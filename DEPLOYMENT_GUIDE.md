# Deployment Guide - Euki Web App

The Euki web application is fully built and ready for deployment to Vercel. Follow the steps below to deploy your application.

## Prerequisites

- Vercel account (free at https://vercel.com)
- Vercel CLI installed (`npm install -g vercel`)
- Git pushed to your repository

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Link your repository to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select project root: select `web-app` folder
   - Click "Deploy"

2. **Vercel will automatically**:
   - Install dependencies
   - Run `npm run build`
   - Deploy the `dist/` folder
   - Provide you with a live URL

### Option 2: Deploy using Vercel CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Navigate to the web-app directory**:
   ```bash
   cd web-app
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

4. **Your app will be available at**: `https://euki-web.vercel.app` (or your custom domain)

### Option 3: Deploy using GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-vercel.yml`) that automatically deploys on every push to `main` branch.

To use this:

1. **Add Vercel secrets to GitHub**:
   - Go to Settings → Secrets and variables → Actions
   - Add `VERCEL_TOKEN`: Get this from https://vercel.com/account/tokens
   - Add `VERCEL_ORG_ID`: Get this from your Vercel account settings

2. **The workflow will automatically deploy** when you push code

## Vercel Project Configuration

The project includes a `vercel.json` configuration that specifies:

```json
{
  "name": "euki-web",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures:
- Build command runs correctly
- Output directory points to the Vite build output
- Client-side routing works properly (SPA rewrites)

## Post-Deployment

After deployment:

1. **Verify the app works**:
   - Visit your deployed URL
   - Test the calendar tracking feature
   - Verify PIN protection works
   - Test educational content navigation

2. **Set up custom domain** (optional):
   - In Vercel dashboard: Settings → Domains
   - Add your custom domain

3. **Enable analytics** (optional):
   - Vercel provides built-in Web Analytics

## Troubleshooting

### Build fails
- Check that Node.js version is 16+
- Ensure all dependencies are listed in `package.json`
- Check build logs in Vercel dashboard

### 404 errors on page refresh
- This is normal for SPAs - the `rewrites` in `vercel.json` should fix it
- Verify `vercel.json` is in the `web-app` root directory

### Large build size
- Current size: ~335KB (optimized)
- Acceptable for Vercel's free tier

## Environment Variables

No environment variables are required. The application stores all data locally in the browser using encrypted localStorage.

## Performance

- Build time: ~10-15 seconds
- Deployment time: ~1-2 minutes
- App size: 335KB (gzipped)
- First Contentful Paint: <1 second
- Suitable for mobile networks

## Security

- All user data stays on their device
- No API calls to external servers
- Data is encrypted using CryptoJS
- PIN code protection available
- No analytics or tracking

## Support

For issues with deployment:
1. Check Vercel's deployment logs
2. Review `vercel.json` configuration
3. Verify build locally: `npm run build && npm run preview`

For app issues:
1. Open browser DevTools (F12)
2. Check browser console for errors
3. Verify localStorage is enabled

## Next Steps

1. Deploy the application using one of the methods above
2. Share the URL with users
3. Users can start tracking their periods immediately
4. All data is private and stays on their device

---

For questions about Euki, visit: https://eukiapp.org/
