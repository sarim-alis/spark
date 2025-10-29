// Google Slides API Integration for Course PPT Generation

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Initialize Google API client
 */
let gapiInitialized = false;
let tokenClient = null;
let accessToken = null;

export const initGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (gapiInitialized) {
      resolve();
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: ['https://slides.googleapis.com/$discovery/rest?version=v1'],
          });
          gapiInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);

    // Load Google Identity Services
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive.file',
        callback: '', // Will be set later
      });
    };
    document.body.appendChild(gisScript);
  });
};

/**
 * Request user authorization
 */
const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    if (accessToken) {
      resolve(accessToken);
      return;
    }

    tokenClient.callback = (response) => {
      if (response.error) {
        reject(response);
        return;
      }
      accessToken = response.access_token;
      window.gapi.client.setToken({ access_token: accessToken });
      resolve(accessToken);
    };

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
};

/**
 * Create a new Google Slides presentation
 */
const createPresentation = async (title) => {
  const response = await window.gapi.client.slides.presentations.create({
    title: title,
  });
  return response.result;
};

/**
 * Build slide requests for batch update
 */
const buildSlideRequests = (courseData, presentationId, slideIds) => {
  const requests = [];
  const lessons = courseData.lessons || [];

  // Title Slide (first slide is auto-created)
  requests.push({
    insertText: {
      objectId: slideIds[0].objectId,
      text: courseData.title,
      insertionIndex: 0,
    },
  });

  // Add subtitle
  requests.push({
    createShape: {
      objectId: `subtitle_${Date.now()}`,
      shapeType: 'TEXT_BOX',
      elementProperties: {
        pageObjectId: slideIds[0].objectId,
        size: {
          width: { magnitude: 600, unit: 'PT' },
          height: { magnitude: 100, unit: 'PT' },
        },
        transform: {
          scaleX: 1,
          scaleY: 1,
          translateX: 50,
          translateY: 300,
          unit: 'PT',
        },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: `subtitle_${Date.now()}`,
      text: courseData.description || 'A comprehensive learning experience',
      insertionIndex: 0,
    },
  });

  // Create slides for each lesson
  lessons.forEach((lesson, index) => {
    const slideId = `lesson_slide_${index}_${Date.now()}`;

    // Create new slide
    requests.push({
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY',
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: { type: 'TITLE' },
            objectId: `${slideId}_title`,
          },
          {
            layoutPlaceholder: { type: 'BODY' },
            objectId: `${slideId}_body`,
          },
        ],
      },
    });

    // Add lesson title
    requests.push({
      insertText: {
        objectId: `${slideId}_title`,
        text: lesson.title,
        insertionIndex: 0,
      },
    });

    // Parse lesson content and extract bullet points
    const content = extractBulletPoints(lesson.content);
    requests.push({
      insertText: {
        objectId: `${slideId}_body`,
        text: content,
        insertionIndex: 0,
      },
    });
  });

  return requests;
};

/**
 * Extract bullet points from HTML content
 */
const extractBulletPoints = (htmlContent) => {
  const div = document.createElement('div');
  div.innerHTML = htmlContent;

  const bullets = [];
  
  // Extract from <li> tags
  const listItems = div.querySelectorAll('li');
  listItems.forEach((li) => {
    bullets.push(`• ${li.textContent.trim()}`);
  });

  // If no bullets, extract from paragraphs
  if (bullets.length === 0) {
    const paragraphs = div.querySelectorAll('p');
    paragraphs.forEach((p, i) => {
      if (i < 5) { // Limit to 5 points
        const text = p.textContent.trim();
        if (text.length > 0 && text.length < 200) {
          bullets.push(`• ${text}`);
        }
      }
    });
  }

  return bullets.join('\n') || '• Key concepts and learning objectives\n• Practical applications\n• Summary and takeaways';
};

/**
 * Apply styling to the presentation
 */
const applyPresentationStyling = (presentationId, slideIds) => {
  const requests = [];

  // Apply theme colors and fonts
  requests.push({
    updatePresentationProperties: {
      fields: 'defaultProperties',
      presentationProperties: {
        defaultProperties: {
          defaultTextStyle: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 14, unit: 'PT' },
          },
        },
      },
    },
  });

  return requests;
};

/**
 * Main function to generate Google Slides presentation
 */
export const generateGoogleSlides = async (courseData) => {
  try {
    console.log('🚀 Starting Google Slides generation...');

    // Initialize Google API
    await initGoogleAPI();
    console.log('✓ Google API initialized');

    // Get access token
    await getAccessToken();
    console.log('✓ Access token obtained');

    // Create presentation
    const presentation = await createPresentation(courseData.title);
    console.log('✓ Presentation created:', presentation.presentationId);

    // Get slide IDs
    const slideIds = presentation.slides.map((slide) => ({
      objectId: slide.objectId,
    }));

    // Build requests
    const requests = buildSlideRequests(courseData, presentation.presentationId, slideIds);

    // Apply styling
    const styleRequests = applyPresentationStyling(presentation.presentationId, slideIds);
    requests.push(...styleRequests);

    // Execute batch update
    await window.gapi.client.slides.presentations.batchUpdate({
      presentationId: presentation.presentationId,
      requests: requests,
    });

    console.log('✓ Slides content added');

    // Return presentation URL
    const presentationUrl = `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`;

    return {
      success: true,
      presentationId: presentation.presentationId,
      presentationUrl: presentationUrl,
      message: 'Google Slides presentation created successfully!',
    };
  } catch (error) {
    console.error('❌ Google Slides generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create Google Slides presentation',
    };
  }
};

/**
 * Open the presentation in a new tab
 */
export const openPresentation = (presentationId) => {
  const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;
  window.open(url, '_blank');
};

export default generateGoogleSlides;
