# Word Cloud Generator - Architecture Documentation

## Overview

The Word Cloud Generator is a modern Next.js application that processes text input to generate visual word clouds. It analyzes word frequency and renders words with sizes proportional to their occurrence count using HTML5 Canvas.

## Technology Stack

### Frontend Framework

- **Next.js 14** - React-based framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript superset

### Styling & UI

- **CSS3** - Custom styling with Grid and Flexbox
- **CSS Variables** - Consistent theming and colors
- **Responsive Design** - Mobile-first approach

### Canvas Rendering

- **HTML5 Canvas API** - Word cloud visualization
- **Custom Canvas Utils** - Abstracted drawing operations

### Testing Framework

- **Vitest** - Fast unit test runner
- **Testing Library** - Component testing utilities
- **JSDOM** - Browser environment simulation
- **Coverage Reports** - v8 provider for test coverage

### Deployment

- **GitHub Pages** - Static site hosting
- **GitHub Actions** - CI/CD pipeline
- **Static Export** - Pre-rendered static files

## Project Structure

```
word-count/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main application page
│   └── globals.css              # Global styles
├── src/
│   ├── utils/                   # Utility functions
│   │   ├── wordUtils.ts         # Text processing logic
│   │   └── canvasUtils.ts       # Canvas drawing operations
│   └── test/                    # Test files
│       ├── setup.ts             # Test configuration
│       ├── wordUtils.test.ts    # Unit tests for word processing
│       ├── canvasUtils.test.ts  # Unit tests for canvas operations
│       ├── Home.test.tsx        # Component integration tests
│       └── integration.test.ts  # End-to-end workflow tests
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
├── next.config.js               # Next.js configuration
├── vitest.config.ts             # Test configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Core Components

### 1. Main Application (`app/page.tsx`)

- **Purpose**: Primary user interface component
- **State Management**: React hooks for form state and word cloud data
- **User Interactions**: Text input, generate/clear buttons
- **Features**:
  - Real-time input validation
  - Loading states during processing
  - Statistics display
  - Canvas integration

### 2. Word Processing Utils (`src/utils/wordUtils.ts`)

- **Purpose**: Text analysis and frequency calculation
- **Key Functions**:
  - `processText()`: Main text processing pipeline
- **Features**:
  - Case normalization
  - Punctuation removal
  - Short word filtering (< 3 characters)
  - Frequency counting
  - Font size calculation (20-80px range)
  - Sorting by frequency

### 3. Canvas Drawing Utils (`src/utils/canvasUtils.ts`)

- **Purpose**: Visual word cloud rendering
- **Key Functions**:
  - `drawWordCloud()`: Canvas rendering pipeline
- **Features**:
  - Dynamic canvas sizing (800x600)
  - Color palette rotation
  - Text positioning algorithm
  - Overflow handling
  - Word wrapping

## Data Flow Architecture

```
User Input (Text)
       ↓
Text Processing (wordUtils.ts)
       ↓
Word Frequency Analysis
       ↓
Font Size Calculation
       ↓
Canvas Rendering (canvasUtils.ts)
       ↓
Visual Word Cloud Display
```

### Detailed Data Flow

1. **Input Collection**

   - User enters text in textarea
   - Input validation ensures non-empty content

2. **Text Processing Pipeline**

   ```typescript
   text → toLowerCase() → removePunctuation() → splitWords() → filterShort() → countFrequency() → calculateSizes() → sortByFrequency()
   ```

3. **Rendering Pipeline**
   ```typescript
   wordData → canvasSetup() → clearCanvas() → positionWords() → drawText() → applyColors()
   ```

## State Management

### Component State (React Hooks)

- `inputText`: Current textarea content
- `wordFrequencies`: Processed word data array
- `isGenerating`: Loading state boolean
- `canvasRef`: Canvas element reference

### Data Models

```typescript
interface WordFrequency {
  text: string; // Normalized word
  size: number; // Font size (20-80px)
  weight: number; // Occurrence count
}
```

## Algorithm Details

### Word Processing Algorithm

1. **Normalization**: Convert to lowercase
2. **Sanitization**: Remove punctuation using regex `/[^\w\s]/g`
3. **Tokenization**: Split on whitespace
4. **Filtering**: Remove words with length ≤ 2
5. **Frequency Counting**: Use Map/Object for O(1) lookups
6. **Size Calculation**: `size = min(max(weight * 20, 20), 80)`
7. **Sorting**: Descending order by frequency

### Canvas Rendering Algorithm

1. **Canvas Setup**: Set dimensions 800x600px
2. **Color Selection**: Cycle through 12-color palette
3. **Text Positioning**:
   - Start at (50, 100)
   - Calculate text width using `measureText()`
   - Wrap to new line when exceeding bounds
   - Increment Y position by font size + padding
4. **Bounds Checking**: Prevent overflow beyond canvas height

## Testing Strategy

### Test Coverage Areas

1. **Unit Tests**

   - Word processing functions
   - Canvas drawing utilities
   - Edge cases and error handling

2. **Component Tests**

   - User interaction flows
   - State management
   - DOM element rendering

3. **Integration Tests**
   - End-to-end workflows
   - Data consistency
   - Performance benchmarks

### Test Environment Setup

- **JSDOM**: Browser API simulation
- **Canvas Mocking**: Mock HTML5 Canvas for testing
- **User Event Simulation**: Realistic user interactions

## Performance Considerations

### Optimization Strategies

1. **Debounced Processing**: Prevent excessive calculations during typing
2. **Canvas Optimization**: Efficient rendering with minimal redraws
3. **Memory Management**: Proper cleanup of canvas contexts
4. **Large Text Handling**: Performance monitoring for 10k+ words

### Scaling Limits

- **Maximum Words**: 30 words displayed (performance cap)
- **Text Size**: Efficiently handles 10,000+ word inputs
- **Canvas Size**: Fixed 800x600 for consistent performance

## Deployment Architecture

### GitHub Pages Deployment

```
Code Push → GitHub Actions → Test Suite → Build Process → Static Export → GitHub Pages
```

### CI/CD Pipeline

1. **Test Stage**: Run all test suites
2. **Coverage**: Generate coverage reports
3. **Build**: Next.js production build
4. **Export**: Static file generation
5. **Deploy**: GitHub Pages deployment

### Environment Configuration

- **Production**: Optimized builds with asset prefix
- **Development**: Hot reload and debugging tools
- **Testing**: Isolated environment with mocks

## Security Considerations

### Input Sanitization

- Text processing removes harmful characters
- No direct HTML injection possible
- Canvas rendering prevents XSS attacks

### Dependency Management

- Regular dependency updates
- Security audit with npm audit
- Minimal external dependencies

## Future Enhancement Opportunities

### Feature Expansions

1. **Download Options**: PNG/SVG export
2. **Customization**: Color themes, fonts, layouts
3. **Advanced Layouts**: Spiral, circular word arrangements
4. **Word Filtering**: Stop words, custom filters
5. **Analytics**: Word frequency insights

### Technical Improvements

1. **Web Workers**: Offload processing for large texts
2. **WebGL**: Hardware-accelerated rendering
3. **Accessibility**: Screen reader support, keyboard navigation
4. **Internationalization**: Multi-language support

## Dependencies Overview

### Production Dependencies

- `next`: Framework and routing
- `react`: UI library
- `react-dom`: DOM rendering

### Development Dependencies

- `vitest`: Test runner
- `@testing-library/*`: Testing utilities
- `typescript`: Type checking
- `@vitejs/plugin-react`: Vite React support

This architecture provides a scalable, maintainable, and well-tested foundation for the word cloud generation application.
