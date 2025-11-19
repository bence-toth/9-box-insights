# 9-Box Insights

A visual tool for analyzing talent distributions using the 9-box or 3-box performance models. This application helps people managers make data-driven decisions about talent management while identifying potential biases in performance evaluations.

## Features

### Distribution analysis

- Automatically calculate the ratios of employees in each box
- Define custom threshold values for individual boxes or box groups
- Highlight violations when distributions fall outside desired ranges

### Bias detection

- Calculate correlation coefficients and p-values for common sources of bias
- Analyze by job level, gender, and other employee attributes (define your own)
- Identify potential systemic issues in performance evaluations

### Interactive interface

- Drag-and-drop employees between boxes
- Filter by teams or departments
- Get real-time updates of distribution metrics

## Get started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/bence-toth/9-box-insights.git
   cd 9-box-insights
   ```

2. **Set up your employee data**

   ```bash
   cp src/employees.example.ts src/employees.ts
   ```

   Edit `src/employees.ts` with your employee data

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure thresholds**
   Edit `src/config.ts` to define your desired distribution thresholds:

   - `boxThresholds` / `box3Thresholds`: Individual box limits
   - `boxGroupThresholds` / `box3GroupThresholds`: Group box limits

5. **Start the application**

   ```bash
   npm start
   ```

   Then click the link in the terminal to open the app in your browser.

6. **Start plotting**
   - Switch between 9-Box and 3-Box views using navigation (careful though, this unplots all plotted employees)
   - Use team filters to narrow your view
   - Drag employees from the "Unplotted" section to their respective boxes
   - Review bias analysis at the bottom of the page

## Security & privacy

⚠️ **IMPORTANT**: This tool is meant to handle sensitive employee information.

The `src/employees.ts` file is automatically excluded from version control via `.gitignore`.

Regardless of that safeguard, please _always_ keep in mind that you should:

- never commit employee data to your repository;
- be cautious when sharing screenshots or demos;
- use anonymized data for testing

## Configuration Options

### Threshold Configuration

Define acceptable ranges for employee distributions in `src/config.ts`:

```typescript
// Individual box thresholds
const boxThresholds = [
  { box: 9, min: 0.05, max: 0.15 }, // Top-right box: 5-15%
];

// Group thresholds (e.g., top-right elbow)
const topRightElbow = [6, 8, 9];
const boxGroupThresholds = [
  { boxes: topRightElbow, max: 0.33 }, // Combined: max 33%
];
```

## Development

### Available Scripts

#### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).  
The page hot-reloads on edits, and lint errors appear in the console.

#### `npm test`

Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run test:coverage`

Generates test coverage reports in the `coverage/` directory.

#### `npm run lint`

Runs both ESLint and StyleLint to check code quality.

#### `npm run lint-js`

Runs ESLint on TypeScript and TSX files.

#### `npm run lint-css`

Runs StyleLint on CSS files.

#### `npm run prettier`

Checks code formatting with Prettier.

#### `npm run build`

Builds the app for production to the `build/` folder.  
Optimizes React in production mode for best performance.  
Files are minified and include content hashes for caching.

See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation between models
- **React DnD** for drag-and-drop functionality
- **jStat** for statistical analysis and bias detection
- **Create React App** for build tooling

### Testing

The project includes unit tests for core functionality:

- Employee data management (`useEmployees.test.tsx`)
- Team filtering logic (`useTeams.test.tsx`)
- Utility functions (`utility.test.ts`)

Run tests with `npm test` or generate coverage reports with `npm run test:coverage`.

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with details about the problem
2. **Suggest Features**: Share ideas for new functionality
3. **Submit PRs**: Fork the repo, make changes, and submit a pull request
4. **Improve Documentation**: Help make the docs clearer and more comprehensive

Please ensure your code:

- Passes all tests (`npm test`)
- Passes linting (`npm run lint`)
- Follows existing code style (`npm run prettier`)
- Includes tests for new features

## Roadmap

Potential future enhancements:

- Export data and visualizations
- Additional statistical analyses
- Custom dimension labels
- Data import from CSV/Excel
- Historical tracking and trends
- More bias detection metrics

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [9-Box Grid Overview](https://en.wikipedia.org/wiki/9-box_grid)

## License

MIT License - see [LICENSE](LICENSE) file for details.

**In short**: You are free to use, modify, and distribute this software for any purpose.

---

Built with ❤️ for better talent management decisions
