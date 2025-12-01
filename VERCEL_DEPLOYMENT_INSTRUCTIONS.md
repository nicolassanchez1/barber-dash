# Vercel Deployment Instructions

## Issue Fixed
The application was showing a blank page when deployed to Vercel because it was configured to use `/tenampa` as the base path, but Vercel serves the application from the root path (`/`). This mismatch caused the application to look for assets and routes in the wrong location.

## Changes Made
- Modified the `.env` file to set `VITE_APP_BASE_NAME` to an empty string instead of `/tenampa`.
- This change affects both the Vite build configuration and the React Router configuration, ensuring that the application is properly configured to be served from the root path.

## How to Deploy to Vercel

1. **Commit the changes to your repository**:
   ```bash
   git add .env
   git commit -m "Fix: Set base path to root for Vercel deployment"
   git push
   ```

2. **Deploy to Vercel**:
   - If you have automatic deployments set up with Vercel, the changes will be deployed automatically when you push to your repository.
   - If not, log in to your Vercel dashboard, select your project, and click "Deploy" to manually trigger a deployment.

3. **Verify the fix**:
   - Once the deployment is complete, visit your Vercel deployment URL.
   - The application should now load correctly instead of showing a blank page.

## Local Development

If you need to continue developing locally with the `/tenampa` base path, you can create a `.env.local` file (which is typically not committed to version control) with:

```
VITE_APP_BASE_NAME=/tenampa
```

This will override the empty base path in the `.env` file when running locally, while still allowing the Vercel deployment to use the root path.

## Troubleshooting

If you still see a blank page after deployment:

1. **Check the browser console for errors**:
   - Open the developer tools in your browser (F12 or right-click > Inspect)
   - Look for any errors in the Console tab that might indicate what's wrong

2. **Verify environment variables in Vercel**:
   - In your Vercel dashboard, go to your project settings
   - Check the Environment Variables section to ensure `VITE_APP_BASE_NAME` is not set to `/tenampa`

3. **Clear browser cache**:
   - Try clearing your browser cache or opening the site in an incognito/private window

4. **Check build logs**:
   - In your Vercel dashboard, check the build logs for any errors during the build process
