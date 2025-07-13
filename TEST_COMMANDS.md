# Install dependencies and run tests

npm install

# Run all tests

npm test

# Run tests with UI

npm run test:ui

# Run tests with coverage

npm run test:coverage

# Run tests in watch mode (development)

npm test -- --watch

# Run specific test file

npm test -- wordUtils.test.ts

# Run tests matching a pattern

npm test -- --grep "should process simple text"
