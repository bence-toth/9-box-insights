# 9-Box Insights

If you are using the 9-box model, you can use this tool to:

- Automatically calculate the ratios of cards in each box
- Define your desired threshold values for each box or box group, and highlight violations
- See correlation coefficients and p-values for common sources of bias e.g. job level and gender

## Get started

1. Clone the repository
2. Make a copy of `src/employees.example.ts` and rename it to `src/employees.ts`, enter your data there
3. Define your box groups and thresholds in `src/config.ts`
4. Run `npm i`
5. Run `npm start`
6. Start plotting

## Cautionary notice

Be careful that you don't accidentally commit (or in any other way expose) sensitive employee information.

To help you with this, I added the `src/employees.ts` file to `.gitignore` for you.

## Contributions

Issues and pull requests are welcome.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run test:coverage`

Generates test coverage reports.

#### `npm run lint:js`

Runs ESLint.

#### `npm run lint:css`

Runs StyleLint.

#### `npm run lint`

Runs both ESLint and StyleLint.

#### `npm run prettier`

Runs Prettier's checker.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### License

MIT. Do what you will.
