# 🚀 Deploy CourseSpark to Your Domain

## ✅ Your Build is Ready!

**Location:** `dist/` folder
**Status:** ✅ Production build created successfully
**Test URL:** http://localhost:4174/ (preview server running)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Free Tier:** ✅ Yes
**Custom Domain:** ✅ Yes (free SSL)
**Time:** 2 minutes

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd /d/AndroppleLab/Projects/coursespark
vercel
```

Follow prompts:
- "Set up and deploy?" → Yes
- "Which scope?" → Your account
- "Link to existing project?" → No
- "What's your project's name?" → coursespark
- "In which directory is your code located?" → ./
- "Want to override the settings?" → No

#### Step 3: Add Your Domain
```bash
vercel domains add yourdomain.com
```

Then add DNS records (Vercel will show you):
- Type: `A` → Value: `76.76.21.21`
- Type: `CNAME` → Value: `cname.vercel-dns.com`

**Done!** Your site will be live at `yourdomain.com`

---

### Option 2: Netlify

**Free Tier:** ✅ Yes
**Custom Domain:** ✅ Yes (free SSL)
**Time:** 3 minutes

#### Method A: Drag & Drop (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag your `dist/` folder into the box
3. Wait for deployment
4. Go to Site Settings → Domain Management → Add custom domain

#### Method B: Netlify CLI
```bash
npm install -g netlify-cli
cd /d/AndroppleLab/Projects/coursespark
netlify deploy --prod --dir=dist
```

Add your domain:
```bash
netlify domains:add yourdomain.com
```

---

### Option 3: GitHub Pages (Free)

**Free Tier:** ✅ Yes
**Custom Domain:** ✅ Yes
**Time:** 5 minutes

#### Step 1: Update vite.config.js
```javascript
// Add base path for GitHub Pages
export default defineConfig({
  base: '/coursespark/',  // Your repo name
  // ... rest of config
})
```

#### Step 2: Rebuild
```bash
npm run build
```

#### Step 3: Deploy
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Step 4: Enable in GitHub
- Go to repo Settings → Pages
- Source: gh-pages branch
- Add custom domain in settings

---

### Option 4: Cloudflare Pages

**Free Tier:** ✅ Yes (unlimited bandwidth!)
**Custom Domain:** ✅ Yes
**Time:** 3 minutes

#### Step 1: Create Cloudflare Account
https://pages.cloudflare.com/

#### Step 2: Connect GitHub Repo
Or use Wrangler CLI:
```bash
npm install -g wrangler
wrangler pages deploy dist
```

#### Step 3: Add Domain
In Cloudflare dashboard → Pages → Custom domains

---

### Option 5: Your Own Server (cPanel/VPS)

**Requirements:** Web hosting with cPanel or SSH access

#### For cPanel:
1. Open File Manager
2. Navigate to `public_html/` (or your domain folder)
3. Upload all files from `dist/` folder
4. Done!

#### For VPS (Ubuntu/Linux):
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Copy files
sudo cp -r /path/to/dist/* /var/www/html/

# Configure Nginx for React Router
sudo nano /etc/nginx/sites-available/default
```

Add this config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx
```

---

## ⚙️ Important: Configure for React Router

Your app uses React Router, so you need to redirect all routes to `index.html`.

### Vercel
Create `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Netlify
Create `netlify.toml` in project root:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages
Create `dist/404.html` (copy of `dist/index.html`)

### Cloudflare Pages
Automatic! (Cloudflare detects React Router)

---

## 🔧 Common Issues & Fixes

### Issue 1: Blank Page After Deploy
**Cause:** Base path incorrect
**Fix:** Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/',  // Use '/' for root domain
  // ... rest
})
```

### Issue 2: 404 on Refresh
**Cause:** Server not configured for SPA
**Fix:** Add redirect rules (see above)

### Issue 3: CSS/JS Not Loading
**Cause:** Wrong base path
**Fix:** Check `vite.config.js` base matches your domain structure

---

## 🎯 Recommended Setup for Your Domain

### Best Option: Vercel
**Why:**
- ✅ Easiest setup (one command)
- ✅ Automatic SSL
- ✅ Global CDN (fast worldwide)
- ✅ Automatic deployments on git push
- ✅ Free custom domain
- ✅ No server configuration needed

### Commands to Deploy Now:
```bash
# Install Vercel
npm install -g vercel

# Deploy
cd /d/AndroppleLab/Projects/coursespark
vercel --prod

# Add your domain
vercel domains add yourdomain.com
```

Follow the DNS instructions Vercel gives you, and you're live! 🚀

---

## 📋 Pre-Deployment Checklist

Before deploying, create these files in your project root:

### 1. Create `vercel.json`
```bash
cat > vercel.json << 'EOF'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
EOF
```

### 2. Create `netlify.toml` (if using Netlify)
```bash
cat > netlify.toml << 'EOF'
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

---

## 🚀 Quick Deploy Now

Run this to deploy to Vercel right now:

```bash
cd /d/AndroppleLab/Projects/coursespark
npx vercel --prod
```

No installation needed! It will ask for your email, create account, and deploy in 2 minutes.

---

## 💡 What Happens After Deploy

1. ✅ Your site goes live at `https://coursespark-xxx.vercel.app`
2. ✅ Add your custom domain in dashboard
3. ✅ SSL certificate auto-generated
4. ✅ Every git push auto-deploys

**Your frontend works 100% without backend!**
- Uses localStorage for data
- All features functional
- No database needed
- No API keys needed

---

Need help with a specific hosting provider? Let me know which one you want to use!
