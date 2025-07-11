# Word Cloud Generator

A beautiful Next.js application that generates word clouds from your text input. The app analyzes word frequency and creates visual word clouds where more frequent words appear larger.

## Features

- ✨ Real-time word cloud generation
- 📊 Word frequency analysis and statistics
- 🎨 Beautiful, responsive design
- 🚀 Optimized for GitHub Pages deployment
- 📱 Mobile-friendly interface

## How to Use

1. Enter your text in the textarea
2. Click "Generate Word Cloud" to create your visualization
3. View statistics about word frequency
4. Use "Clear" to reset and start over

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files
npm run export
```

## Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push to the main branch and the workflow will:

1. Build the Next.js application
2. Export static files
3. Deploy to GitHub Pages

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- HTML5 Canvas for word cloud rendering
- CSS Grid and Flexbox for responsive layout

## Live Demo

Visit the live application at: `https://yourusername.github.io/word-count/`

## License

MIT License - feel free to use this project for your own purposes.
