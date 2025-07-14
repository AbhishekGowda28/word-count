# Word Cloud Generator

A beautiful Next.js application that generates word clouds from your text input. The app analyzes word frequency and creates visual word clouds where more frequent words appear larger.

## Features

- ✨ Real-time word cloud generation
- 📊 Word frequency analysis and statistics
- 🎨 Beautiful, responsive design
- 🚀 Optimized for GitHub Pages deployment
- 📱 Mobile-friendly interface
- 🧪 Comprehensive test coverage with Vitest

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

## Testing

This project uses Vitest for testing with comprehensive coverage:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- **Unit Tests**: Test individual utility functions (word processing, canvas operations)
- **Component Tests**: Test React components with user interactions
- **Integration Tests**: Test complete workflows and edge cases
- **Canvas Mocking**: Mock HTML5 Canvas API for reliable testing

## Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions. The workflow includes:

1. **Test Stage**: Runs all tests and generates coverage reports
2. **Build Stage**: Builds the Next.js application (only if tests pass)
3. **Deploy Stage**: Exports static files and deploys to GitHub Pages

Simply push to the main branch and the workflow will handle everything automatically.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Vitest for testing
- Testing Library for component testing
- HTML5 Canvas for word cloud rendering
- CSS Grid and Flexbox for responsive layout

## Project Structure

```
src/
├── utils/
│   ├── wordUtils.ts      # Word processing logic
│   └── canvasUtils.ts    # Canvas drawing utilities
└── test/
    ├── setup.ts          # Test configuration
    ├── wordUtils.test.ts  # Unit tests for word processing
    ├── canvasUtils.test.ts # Unit tests for canvas operations
    ├── Home.test.tsx     # Component tests
    └── integration.test.ts # Integration tests
```

## Live Demo

Visit the live application at: `https://abhishekgowda28.github.io/word-count/`

## License

MIT License - feel free to use this project for your own purposes.
