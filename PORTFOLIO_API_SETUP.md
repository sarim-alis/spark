# Portfolio API Setup Complete

## Backend Changes

### 1. Database Migration
**File**: `Backend/database/migrations/2025_01_21_000001_create_portfolio_table.php`
- Creates `portfolio` table with all required fields
- Foreign key to `users.email`
- Unique constraint on `custom_slug`
- JSON fields for `featured_projects`, `skills`, `certificates`, `social_links`

**Run migration**:
```bash
cd Backend
php artisan migrate
```

### 2. Eloquent Model
**File**: `Backend/app/Models/Portfolio.php`
- Table: `portfolio`
- Fillable fields: user_email, custom_slug, display_name, headline, bio, profile_image, featured_projects, skills, certificates, social_links, is_public, view_count
- Casts JSON fields to arrays
- Relationship: `user()` belongsTo User

### 3. Controller
**File**: `Backend/app/Http/Controllers/PortfolioController.php`

**Methods**:
- `index()` - List portfolios with filters (user_email, custom_slug, is_public)
- `store()` - Create new portfolio
- `show($id)` - Get portfolio by ID
- `showBySlug($slug)` - Get portfolio by custom slug (increments view_count)
- `update($id)` - Update portfolio
- `destroy($id)` - Delete portfolio
- `getMyPortfolio()` - Get authenticated user's portfolio

### 4. API Routes
**File**: `Backend/routes/api.php`

All routes require authentication (`auth:sanctum` middleware):
```
GET    /api/portfolio                    - List portfolios
POST   /api/portfolio                    - Create portfolio
GET    /api/portfolio/me                 - Get my portfolio
GET    /api/portfolio/slug/{slug}        - Get by slug (public view)
GET    /api/portfolio/{id}               - Get by ID
PUT    /api/portfolio/{id}               - Update portfolio
PATCH  /api/portfolio/{id}               - Update portfolio
DELETE /api/portfolio/{id}               - Delete portfolio
```

## Frontend Changes

### 1. API Service
**File**: `Frontend/coursespark/src/services/portfolioApi.js`

**Methods**:
- `list(params)` - Get all portfolios with filters
- `get(id)` - Get portfolio by ID
- `getBySlug(slug)` - Get portfolio by slug
- `getMyPortfolio()` - Get current user's portfolio
- `create(data)` - Create new portfolio
- `update(id, data)` - Update portfolio
- `delete(id)` - Delete portfolio

### 2. Portfolio Page
**File**: `Frontend/coursespark/src/pages/Portfolio.jsx`

**Features**:
- Fetches portfolio from API on mount
- Supports viewing by slug: `/portfolio?view=username`
- Auto-creates portfolio if user doesn't have one
- Edit mode with live updates
- Save changes to API
- Share link generation
- Error handling and loading states

**Flow**:
1. Check URL for `?view=slug` parameter
2. If slug exists: fetch that user's portfolio
3. If no slug: fetch current user's portfolio
4. If no portfolio exists: create default portfolio
5. Display portfolio with edit/share controls for owner

## Usage Examples

### Create Portfolio (Backend)
```bash
curl -X POST http://localhost:8000/api/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "user@example.com",
    "custom_slug": "johndoe",
    "display_name": "John Doe",
    "headline": "Full-Stack Developer",
    "bio": "Passionate about building great products",
    "skills": ["React", "Node.js", "Python"],
    "featured_projects": [
      {
        "title": "My App",
        "description": "A cool app",
        "technologies": ["React", "Express"],
        "live_url": "https://example.com",
        "github_url": "https://github.com/user/repo"
      }
    ],
    "social_links": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "is_public": true
  }'
```

### Get Portfolio by Slug
```bash
curl http://localhost:8000/api/portfolio/slug/johndoe \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Portfolio
```bash
curl -X PUT http://localhost:8000/api/portfolio/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Senior Full-Stack Developer",
    "bio": "Updated bio"
  }'
```

## Frontend Usage

### View Own Portfolio
Navigate to: `http://localhost:5173/portfolio`

### View Someone's Portfolio
Navigate to: `http://localhost:5173/portfolio?view=johndoe`

### Edit Portfolio
1. Navigate to your portfolio
2. Click "Edit Portfolio" button
3. Modify fields inline
4. Click "Save Changes"

### Share Portfolio
1. Navigate to your portfolio
2. Click "Share" button
3. Link copied to clipboard: `http://localhost:5173/portfolio?view=your-slug`

## Next Steps

1. **Run migration**: `cd Backend && php artisan migrate`
2. **Test API**: Use Postman or curl to test endpoints
3. **Test Frontend**: Navigate to `/portfolio` in your app
4. **Customize**: Add more fields or features as needed

## Notes

- All routes require authentication
- `custom_slug` must be unique across all portfolios
- `view_count` auto-increments when viewing by slug
- JSON fields (featured_projects, skills, etc.) are automatically cast to arrays in the model
- Frontend auto-creates portfolio if user doesn't have one
