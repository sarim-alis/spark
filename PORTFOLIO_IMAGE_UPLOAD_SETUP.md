# Portfolio Image Upload Setup

## Overview
Added image upload functionality to Portfolio page, matching the Profile page implementation using Cloudinary.

---

## Backend Changes

### 1. PortfolioController.php
**File**: `Backend/app/Http/Controllers/PortfolioController.php`

#### Added Cloudinary Import
```php
use Cloudinary\Cloudinary;
```

#### Updated `store()` Method
- Changed validation: `'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120'`
- Added Cloudinary upload logic
- Uploads to `portfolios` folder
- Returns secure URL

```php
if ($request->hasFile('profile_image')) {
    $cloudinary = new Cloudinary([...]);
    $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
        'folder' => 'portfolios',
        'resource_type' => 'image'
    ]);
    $data['profile_image'] = $result['secure_url'];
}
```

#### Updated `update()` Method
- Same validation and upload logic as `store()`
- Handles image replacement on update

---

## Frontend Changes

### 1. portfolioApi.js
**File**: `Frontend/coursespark/src/services/portfolioApi.js`

#### Updated `create()` Method
```javascript
create: (data) => {
    // If data contains a file, use FormData
    if (data.profile_image instanceof File) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'featured_projects' || key === 'skills' || 
                key === 'certificates' || key === 'social_links') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post('/portfolio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return api.post('/portfolio', data);
}
```

#### Updated `update()` Method
- Same FormData logic as `create()`
- Uses POST with FormData (Laravel method spoofing)
- JSON stringifies array fields

---

### 2. Portfolio.jsx
**File**: `Frontend/coursespark/src/pages/Portfolio.jsx`

#### Added Imports
```javascript
import { Upload } from 'lucide-react';
```

#### Added State
```javascript
const [profileImageFile, setProfileImageFile] = useState(null);
```

#### Added File Handler
```javascript
const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setProfileImageFile(e.target.files[0]);
    }
};
```

#### Updated Save Handler
```javascript
const handleSave = async () => {
    const updatedData = { ...portfolio };
    
    // Add profile image file if selected
    if (profileImageFile) {
        updatedData.profile_image = profileImageFile;
    }
    
    await portfolioAPI.update(portfolio.id, updatedData);
    
    // Reload portfolio to get updated image URL
    const response = await portfolioAPI.getMyPortfolio();
    setPortfolio(response.data.data);
    
    setIsEditing(false);
    setProfileImageFile(null);
    toast.success('Portfolio updated successfully!');
};
```

#### Updated UI - Image Display
```jsx
<div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
  {profileImageFile ? (
    <img src={URL.createObjectURL(profileImageFile)} alt={portfolio.display_name} className="w-full h-full object-cover" />
  ) : portfolio.profile_image ? (
    <img src={portfolio.profile_image} alt={portfolio.display_name} className="w-full h-full object-cover" />
  ) : (
    <Briefcase className="w-16 h-16" />
  )}
</div>
```

#### Added Upload Button (Edit Mode Only)
```jsx
{isEditing && (
  <div className="mt-2">
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={() => document.getElementById('portfolio-image-upload').click()} 
      type="button"
    >
      <Upload className="w-4 h-4 mr-2" />
      Change Photo
    </Button>
    <input 
      id="portfolio-image-upload" 
      type="file" 
      className="hidden" 
      accept="image/*" 
      onChange={handleFileChange} 
    />
  </div>
)}
```

---

## Features

✅ **Image Upload**: Upload profile images to Cloudinary  
✅ **Preview**: Live preview before saving  
✅ **Validation**: JPG, PNG, GIF, WEBP (max 5MB)  
✅ **Storage**: Cloudinary folder `portfolios/`  
✅ **Edit Mode**: Upload button only visible when editing  
✅ **Fallback**: Shows Briefcase icon if no image  
✅ **Toast Notifications**: Success/error feedback  

---

## User Flow

### Upload Image
1. Click **"Edit Portfolio"** button
2. Click **"Change Photo"** button below avatar
3. Select image file (JPG, PNG, GIF, WEBP)
4. See live preview
5. Click **"Save Changes"**
6. Image uploads to Cloudinary
7. Portfolio updates with new image URL
8. Toast notification confirms success

### View Image
- **Own Portfolio**: Shows uploaded image or Briefcase icon
- **Others' Portfolio**: Shows their uploaded image or Briefcase icon
- **Image Display**: Circular avatar (132x132px)

---

## API Endpoints

### Create Portfolio with Image
```bash
POST /api/portfolio
Content-Type: multipart/form-data

FormData:
- user_email: string
- custom_slug: string
- display_name: string
- profile_image: File
- headline: string (optional)
- bio: string (optional)
- ... other fields
```

### Update Portfolio with Image
```bash
POST /api/portfolio/{id}
Content-Type: multipart/form-data

FormData:
- profile_image: File
- display_name: string (optional)
- ... other fields
```

---

## Cloudinary Configuration

Ensure these environment variables are set in `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Comparison with Profile Page

| Feature | Profile Page | Portfolio Page |
|---------|-------------|----------------|
| **Upload Button** | ✅ | ✅ |
| **Live Preview** | ✅ | ✅ |
| **Cloudinary** | ✅ | ✅ |
| **FormData** | ✅ | ✅ |
| **Toast Notifications** | ❌ (uses antd message) | ✅ (uses react-hot-toast) |
| **Folder** | `profiles/` | `portfolios/` |
| **Field Name** | `profile_picture_url` | `profile_image` |
| **Max Size** | 5MB | 5MB |
| **Formats** | JPG, PNG, GIF, WEBP | JPG, PNG, GIF, WEBP |

---

## Testing

### Test Upload
1. Navigate to `/portfolio`
2. Click "Edit Portfolio"
3. Click "Change Photo"
4. Select an image
5. Verify preview appears
6. Click "Save Changes"
7. Verify image uploads and displays
8. Check Cloudinary dashboard for uploaded file

### Test Update
1. Edit portfolio again
2. Upload different image
3. Verify old image is replaced
4. Check new URL in database

---

## Notes

- **Array Fields**: `featured_projects`, `skills`, `certificates`, `social_links` are JSON stringified in FormData
- **Method Spoofing**: Update uses POST with FormData (Laravel handles this)
- **Image Reload**: After save, portfolio is reloaded to get Cloudinary URL
- **File Reset**: `profileImageFile` state is cleared after successful upload
- **Error Handling**: Cloudinary errors return 500 with error message

---

## Status

✅ **Backend**: PortfolioController updated with Cloudinary upload  
✅ **API Service**: portfolioApi.js handles FormData  
✅ **Frontend**: Portfolio.jsx has upload UI and logic  
✅ **Validation**: File type and size validation  
✅ **Preview**: Live image preview before upload  
✅ **Notifications**: Toast feedback for success/error  

**Implementation Complete!** 🎉
