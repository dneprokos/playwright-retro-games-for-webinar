# Playwright Retro Games E2E Testing

A comprehensive end-to-end testing suite for a retro games web application built with Playwright and TypeScript. This project demonstrates modern testing practices including page object models, API testing, custom fixtures, and visual regression testing.

## 🎮 Project Overview

This testing framework is designed to validate the functionality of a retro games web application that allows users to:
- Browse and search retro games
- View detailed game information
- Login as different user types (admin, owner)
- Manage games (add, edit, delete) for admin users
- Authenticate via UI and API endpoints

## 🏗️ Architecture

The project follows a well-structured testing architecture:

```
playwright-retro-games/
├── config/                 # Configuration management
├── fixtures/              # Custom Playwright fixtures
├── framework/             # Base classes and utilities
├── pages/                 # Page Object Models
│   ├── admin_page_fragments/  # Admin page components
│   └── ...
├── services/              # API service layer
│   └── retro-games-api/
├── tests/                 # Test specifications
│   └── factories/         # Test data factories
└── playwright.config.ts   # Playwright configuration
```

## 🚀 Features

- **Page Object Model**: Clean separation of test logic and page interactions
- **Custom Fixtures**: Reusable test setup and teardown
- **API Testing**: Direct API calls for faster test execution
- **Visual Regression Testing**: Screenshot comparison for UI validation
- **Data Factories**: Faker.js integration for test data generation
- **Environment Configuration**: Secure environment variable management
- **Multi-browser Support**: Chrome, Firefox, Safari, and mobile testing
- **Parallel Execution**: Optimized test execution with configurable workers

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser (for local testing)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-retro-games
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   HEADLESS_BROWSER=true
   WORKERS=4
   RETRY_FAILED=1
   MAX_TEST_RUNTIME=30000
   BASE_URL=http://your-app-url.com
   OWNER_EMAIL=owner@example.com
   OWNER_PASSWORD=owner_password
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin_password
   ```

## 🧪 Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

### Run tests with specific browser
```bash
npx playwright test --project="Google Chrome"
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests with specific tag
```bash
# Run tests with @smoke tag
npx playwright test --grep @smoke

# Run tests with @regression tag
npx playwright test --grep @regression

# Run tests with @api tag
npx playwright test --grep @api

# Run tests with @ui tag
npx playwright test --grep @ui

# Run tests with multiple tags (AND logic)
npx playwright test --grep "@smoke.*@critical"

# Run tests with multiple tags (OR logic)
npx playwright test --grep "@smoke|@regression"

# Exclude tests with specific tag
npx playwright test --grep-invert @slow
```

### Generate and view test report
```bash
npx playwright show-report
```

## 📁 Test Structure

### Test Categories

1. **Authentication Tests** (`login.spec.ts`)
   - UI-based login validation
   - API-based authentication
   - User role verification

2. **Game Management Tests** (`add_new_game.spec.ts`)
   - Game creation with full data validation
   - API and UI assertions
   - Test data cleanup

3. **Game Details Tests** (`game_details.spec.ts`)
   - Game information display
   - Visual regression testing

4. **Search Functionality** (`home_search.spec.ts`)
   - Game search and filtering
   - Search result validation

### Test Tagging

You can organize tests using tags for better test execution control:

```typescript
// Example: Adding tags to test descriptions
test.describe("Login feature tests @auth @smoke", () => {
  test("admin should login via UI with valid credentials @ui @critical", async ({
    loginPage,
    homePage,
  }) => {
    // Test implementation
  });

  test("admin should login via local storage with valid credentials @api @regression", async ({
    homePage,
    api,
  }) => {
    // Test implementation
  });
});

// Example: Tagging entire test suites
test.describe("Add new game e2e tests @admin @regression", () => {
  test("should create a new game with all populated data @critical @smoke", async ({
    adminLoggedPage,
    api,
  }) => {
    // Test implementation
  });
});
```

**Common Tag Categories:**
- `@smoke` - Quick validation tests
- `@regression` - Comprehensive test coverage
- `@critical` - High-priority tests
- `@ui` - User interface tests
- `@api` - API integration tests
- `@slow` - Time-consuming tests
- `@auth` - Authentication-related tests
- `@admin` - Admin functionality tests

### Page Objects

- **BasePage**: Common page functionality
- **LoginPage**: Authentication page interactions
- **HomePage**: Main application page
- **AdminPage**: Administrative functions
- **GameDetailsPage**: Individual game information

### API Services

- **AuthAPI**: Authentication endpoints
- **GamesAPI**: Game CRUD operations
- **GamesAPIFacade**: High-level game operations

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

- **Browsers**: Chrome (default), Firefox, Safari, mobile browsers
- **Parallel Execution**: Configurable worker count
- **Retry Logic**: Automatic retry for failed tests
- **Reporting**: HTML and line reporters
- **Screenshots/Videos**: Captured on test failure

### Environment Configuration (`config/config.ts`)

- Environment variable validation using Joi
- Type-safe configuration access
- Required variables validation

## 🎯 Test Data Management

### Factories (`tests/factories/`)

The project uses Faker.js for generating realistic test data:

```typescript
// Example from game factory
const gameName = faker.company.buzzPhrase();
const genre = faker.helpers.arrayElement(allowedGenres);
const releaseDate = faker.date.between({ from: "1990-01-01", to: "1999-12-31" });
```

### Test Cleanup

Tests automatically clean up created data using `afterEach` hooks:

```typescript
test.afterEach(async ({ api, jwtToken }) => {
  if (createdGameId) {
    await api.games.deleteGame(createdGameId, jwtToken);
    createdGameId = null;
  }
});
```

## 🔐 Security Considerations

- **Environment Variables**: Sensitive data stored in `.env` file (not committed)
- **JWT Tokens**: Secure token management for API authentication
- **Password Handling**: Credentials validated but not logged

## 📊 Test Reports

### HTML Report
- Detailed test results with screenshots and videos
- Interactive timeline and trace viewer
- Available at `playwright-report/index.html`

### Line Report
- Console output for CI/CD integration
- Real-time test progress

## 🚀 CI/CD Integration

The project is configured for continuous integration:

- **Parallel Execution**: Optimized for CI environments
- **Retry Logic**: Automatic retry on CI failures
- **Worker Configuration**: Single worker on CI for stability
- **Forbid Only**: Prevents accidental test.only in production

## 🛠️ Development

### Adding New Tests

1. Create test file in `tests/` directory
2. Use existing page objects or create new ones
3. Follow the established naming conventions
4. Include proper cleanup in `afterEach` hooks

### Creating Page Objects

1. Extend `BasePage` class
2. Define locators and actions
3. Include proper error handling
4. Add TypeScript interfaces for data structures

### API Testing

1. Use existing API services in `services/retro-games-api/`
2. Create new API methods as needed
3. Include proper authentication handling
4. Validate responses using Joi schemas

## 📝 Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types
3. Include comprehensive test coverage
4. Update documentation for new features
5. Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For questions or issues:
1. Check the existing test examples
2. Review the Playwright documentation
3. Create an issue with detailed reproduction steps

---

**Happy Testing! 🎮🧪**
