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

    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    tokenClient.callback = (response) => {
      if (response.error) {
        console.error('OAuth error:', response);
        reject(new Error(response.error || 'Authorization failed'));
        return;
      }
      accessToken = response.access_token;
      window.gapi.client.setToken({ access_token: accessToken });
      resolve(accessToken);
    };

    try {
      // Use prompt: '' for popup, or 'consent' to force account selection
      tokenClient.requestAccessToken({ 
        prompt: '',
        // hint: 'Try allowing popups if this fails'
      });
    } catch (error) {
      console.error('Failed to request access token:', error);
      reject(new Error('Failed to open authorization popup. Please allow popups for this site.'));
    }
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
 * Parse lesson content into sections
 */
const parseLessonSections = (lesson) => {
  const htmlContent = lesson.content || '';
  const div = document.createElement('div');
  div.innerHTML = htmlContent;

  const sections = [];
  const headings = div.querySelectorAll('h3');
  
  headings.forEach((h3) => {
    const heading = h3.textContent.trim();
    let nextElement = h3.nextElementSibling;
    let content = '';
    
    if (nextElement && nextElement.tagName === 'P') {
      content = nextElement.textContent.trim();
    }
    
    if (heading && content) {
      sections.push({ heading, content });
    }
  });

  return sections;
};

/**
 * Build slide requests for batch update - creates one slide per section
 */
const buildSlideRequests = (courseData, layoutObjectId) => {
  const requests = [];
  const lessons = courseData.lessons || [];
  let slideIndex = 1; // Start after title slide
  
  // Create one slide for each section (1 section per slide)
  lessons.forEach((lesson, lessonIndex) => {
    const sections = parseLessonSections(lesson);
    
    // Create one slide per section
    sections.forEach((section, sectionIndex) => {
      const slideId = `lesson_${lessonIndex}_section_${sectionIndex}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const slideRequest = {
        createSlide: {
          objectId: slideId,
          insertionIndex: slideIndex++,
        }
      };

      if (layoutObjectId) {
        slideRequest.createSlide.slideLayoutReference = {
          predefinedLayout: 'TITLE_AND_BODY'
        };
      }

      requests.push(slideRequest);
    });
  });

  return requests;
};

/**
 * Format single section for slide - just return the content
 */
const formatSectionContent = (section) => {
  // Return just the content paragraph, heading goes in title
  return section.content;
};

/**
 * Extract first sentence from description for title slide
 */
const extractFirstSentence = (description) => {
  if (!description) return '';
  
  // Find the first sentence (ends with . ! or ?)
  const match = description.match(/^[^.!?]+[.!?]/);
  if (match) {
    return match[0].trim();
  }
  
  // If no sentence ending found, take first 100 characters
  return description.substring(0, 100).trim() + '...';
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
 * Download presentation as PowerPoint file
 */
const downloadAsPowerPoint = async (presentationId, fileName) => {
  try {
    // Export URL for PowerPoint format
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation`;
    
    const response = await fetch(exportUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export presentation');
    }

    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✓ PowerPoint downloaded');
    return true;
  } catch (error) {
    console.error('❌ Download error:', error);
    return false;
  }
};

/**
 * Delete presentation from Google Drive
 */
const deletePresentation = async (presentationId) => {
  try {
    await window.gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${presentationId}`,
      method: 'DELETE',
    });
    console.log('✓ Temporary presentation deleted from Drive');
  } catch (error) {
    console.error('⚠️ Failed to delete temporary file:', error);
  }
};

/**
 * Main function to generate Google Slides presentation and download as PPT
 */
export const generateGoogleSlides = async (courseData) => {
  let presentationId = null;
  
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
    presentationId = presentation.presentationId;
    console.log('✓ Presentation created:', presentationId);

    // Get the presentation with full details including layouts
    const fullPresentation = await window.gapi.client.slides.presentations.get({
      presentationId: presentationId,
    });

    // Find a suitable layout (TITLE_AND_BODY or similar)
    const layouts = fullPresentation.result.layouts || [];
    let layoutId = null;
    
    // Try to find TITLE_AND_BODY layout
    for (const layout of layouts) {
      if (layout.layoutProperties?.name?.includes('TITLE_AND_BODY') || 
          layout.layoutProperties?.name?.includes('Title and Body')) {
        layoutId = layout.objectId;
        break;
      }
    }
    
    // If not found, use the second layout (first is usually title slide)
    if (!layoutId && layouts.length > 1) {
      layoutId = layouts[1].objectId;
    }
    
    // If still not found, use the first available layout
    if (!layoutId && layouts.length > 0) {
      layoutId = layouts[0].objectId;
    }

    console.log('✓ Using layout ID:', layoutId);

    // Build requests for lesson slides
    const requests = buildSlideRequests(courseData, layoutId);

    console.log('📝 Batch update requests:', JSON.stringify(requests, null, 2));

    // Execute batch update to create lesson slides
    if (requests.length > 0) {
      try {
        await window.gapi.client.slides.presentations.batchUpdate({
          presentationId: presentationId,
          requests: requests,
        });
        console.log('✓ Lesson slides created');
      } catch (error) {
        console.error('❌ Batch update error details:', {
          message: error.result?.error?.message,
          details: error.result?.error?.details,
          status: error.result?.error?.status,
          fullError: error
        });
        throw new Error('Failed to create slides: ' + (error.result?.error?.message || error.message));
      }
    }

    // Now add content to the lesson slides
    try {
      // Fetch the updated presentation to get the new slide IDs
      const updatedPresentation = await window.gapi.client.slides.presentations.get({
        presentationId: presentationId,
      });

      const lessons = courseData.lessons || [];
      const contentRequests = [];

      // Skip the first slide (title slide) and add content to lesson slides
      const slides = updatedPresentation.result.slides.slice(1);
      let slideIdx = 0;

      lessons.forEach((lesson, lessonIndex) => {
        const sections = parseLessonSections(lesson);
        
        // One slide per section
        sections.forEach((section, sectionIndex) => {
          if (slideIdx >= slides.length) return;
          
          const slide = slides[slideIdx];
          
          // Find title and body placeholders
          const titlePlaceholder = slide.pageElements?.find(
            el => el.shape?.placeholder?.type === 'TITLE' || el.shape?.placeholder?.type === 'CENTERED_TITLE'
          );
          const bodyPlaceholder = slide.pageElements?.find(
            el => el.shape?.placeholder?.type === 'BODY'
          );

          // Delete existing text in placeholders first
          if (titlePlaceholder && titlePlaceholder.shape?.text?.textElements) {
            const textElements = titlePlaceholder.shape.text.textElements;
            if (textElements.length > 1) { // More than just the empty element
              contentRequests.push({
                deleteText: {
                  objectId: titlePlaceholder.objectId,
                  textRange: {
                    type: 'ALL'
                  }
                }
              });
            }
          }

          if (bodyPlaceholder && bodyPlaceholder.shape?.text?.textElements) {
            const textElements = bodyPlaceholder.shape.text.textElements;
            if (textElements.length > 1) {
              contentRequests.push({
                deleteText: {
                  objectId: bodyPlaceholder.objectId,
                  textRange: {
                    type: 'ALL'
                  }
                }
              });
            }
          }

          // Add section heading as slide title
          if (titlePlaceholder) {
            contentRequests.push({
              insertText: {
                objectId: titlePlaceholder.objectId,
                text: section.heading,
                insertionIndex: 0,
              },
            });
          }

          // Add section content as slide body
          if (bodyPlaceholder) {
            const content = formatSectionContent(section);
            contentRequests.push({
              insertText: {
                objectId: bodyPlaceholder.objectId,
                text: content,
                insertionIndex: 0,
              },
            });
          }
          
          slideIdx++;
        });
      });

      if (contentRequests.length > 0) {
        await window.gapi.client.slides.presentations.batchUpdate({
          presentationId: presentationId,
          requests: contentRequests,
        });
        console.log('✓ Lesson content added');
      }
    } catch (error) {
      console.warn('⚠️ Could not add lesson content:', error);
    }

    // Update the first slide (title slide) separately
    try {
      // Get the presentation to find placeholder IDs
      const presentationData = await window.gapi.client.slides.presentations.get({
        presentationId: presentationId,
      });

      const firstSlide = presentationData.result.slides[0];
      const titlePlaceholder = firstSlide.pageElements?.find(
        el => el.shape?.placeholder?.type === 'CENTERED_TITLE' || el.shape?.placeholder?.type === 'TITLE'
      );
      const subtitlePlaceholder = firstSlide.pageElements?.find(
        el => el.shape?.placeholder?.type === 'SUBTITLE'
      );

      const titleRequests = [];
      
      if (titlePlaceholder) {
        titleRequests.push({
          insertText: {
            objectId: titlePlaceholder.objectId,
            text: courseData.title,
            insertionIndex: 0,
          },
        });
      }

      if (subtitlePlaceholder && courseData.description) {
        // Extract only the first sentence for a one-line description
        const oneLineDescription = extractFirstSentence(courseData.description);
        titleRequests.push({
          insertText: {
            objectId: subtitlePlaceholder.objectId,
            text: oneLineDescription,
            insertionIndex: 0,
          },
        });
      }

      if (titleRequests.length > 0) {
        await window.gapi.client.slides.presentations.batchUpdate({
          presentationId: presentationId,
          requests: titleRequests,
        });
        console.log('✓ Title slide updated');
      }
    } catch (error) {
      console.warn('⚠️ Could not update title slide:', error);
    }

    console.log('✓ All slides content added');

    // Download as PowerPoint
    const fileName = courseData.title.replace(/[^a-z0-9]/gi, '_');
    const downloaded = await downloadAsPowerPoint(presentationId, fileName);
    
    if (!downloaded) {
      throw new Error('Failed to download presentation');
    }

    // Delete from Google Drive (cleanup)
    await deletePresentation(presentationId);

    return {
      success: true,
      message: 'PowerPoint presentation downloaded successfully!',
      fileName: `${fileName}.pptx`,
    };
  } catch (error) {
    console.error('❌ Google Slides generation error:', error);
    
    // Cleanup: try to delete the presentation if it was created
    if (presentationId) {
      await deletePresentation(presentationId);
    }
    
    return {
      success: false,
      error: error.message || 'Failed to generate presentation',
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
