# Welcome to Pulse Feed Project

## Project info

**URL**: https://lovable.dev/projects/cf4f9e3d-75b2-4ccc-94c2-0efe43f6f35f

#The version 2 is deployed on vecel

**URL**: pulse-feed-fbwu8q4zh-syed-danial-khurrams-projects.vercel.app 

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cf4f9e3d-75b2-4ccc-94c2-0efe43f6f35f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cf4f9e3d-75b2-4ccc-94c2-0efe43f6f35f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Frontend Changes

### 1. Layout Modifications
- **Removed streaming/trending sidebars**: Eliminated `NewsTicker` components from both sides of the main content area
- **4-column grid layout**: Changed from 3-column layout with sidebars to a responsive 4-column grid:
  - 1 column on mobile (`grid-cols-1`)
  - 2 columns on medium screens (`md:grid-cols-2`) 
  - 3 columns on large screens (`lg:grid-cols-3`)
  - 4 columns on extra-large screens (`xl:grid-cols-4`)

### 2. Authentication Disabled
- **AuthContext.tsx**: Commented out all authentication functionality
  - Disabled API calls to login/signup endpoints
  - User state always returns `null`
  - Auth functions now log "Authentication disabled" instead of executing
- **Header.tsx**: Removed sign-in/sign-up buttons from the header
  - Only shows PulseFeed logo and Newsletter link

### 3. Voice Feature Implementation
- **Speaker Button**: Added prominent voice control button next to the main title
  - Uses `Volume2` and `VolumeX` icons from Lucide React
  - Button changes appearance based on playing state (default/destructive variant)
- **Text-to-Speech Functionality**:
  - Reads all visible news summaries when activated
  - Combines article titles and summaries into spoken content
  - Configurable speech settings (rate: 0.8, pitch: 1, volume: 0.9)
  - Proper state management for play/stop functionality

### 4. Enhanced News Cards
- **60-word Summaries**: Updated NewsCard component to better display longer content
  - Changed from `line-clamp-3` to `line-clamp-4` for summary text # Needs to be changed so that summary be showed not broken info
  - Added `leading-relaxed` for better readability
  - Maintained responsive design and hover effects

## Technical Details

### Frontend Dependencies
- Uses existing React/TypeScript setup with Vite
- Leverages Web Speech API for text-to-speech functionality
- Maintains responsive design with Tailwind CSS
- Compatible with existing shadcn/ui component library

## Testing Instructions

### Frontend Testing
1. Start the frontend development server:
   ```bash
   cd pulseFeed
   npm run dev
   ```

2. Verify the following:
   - 4-column responsive grid layout works across different screen sizes
   - Voice/speaker button appears next to the main title
   - Clicking voice button reads news summaries aloud
   - No authentication buttons appear in header
   - News cards display 60-word summaries properly

## File Changes Summary

### Frontend Files Modified:
- `src/pages/Index.tsx` - Complete rewrite with new layout and voice feature
- `src/context/AuthContext.tsx` - Authentication disabled
- `src/components/layout/Header.tsx` - Auth buttons removed
- `src/components/news/NewsCard.tsx` - Enhanced for longer summaries

