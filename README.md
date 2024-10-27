# Todoist Task Scoring Lambda Function

This project contains an AWS Lambda function that interacts with the Todoist API to fetch completed tasks for a given number of days and calculate a score based on assigned labels. The scores are then returned as a JSON object, with each day getting a cumulative score based on the labels attached to completed tasks.

## Features

- Uses the Todoist Sync API (`v9`) to fetch completed tasks.
- Filters tasks based on dates and labels to calculate daily scores.
- Outputs the result in JSON format suitable for integration with other systems.

## Getting Started

### Prerequisites

- **Node.js** installed locally.
- **AWS CLI** configured with access to your AWS account.
- **Yarn** or **npm** for managing dependencies.
- **Todoist API Token**: You need a Todoist API token to access your completed tasks.

### Setup Instructions

1. **Clone the repository** or copy the code provided.
2. **Install dependencies**:
   ```bash
   yarn add axios dotenv luxon
   ```
3. **Set up environment variables**:
   - Create a `.env` file in the root directory and add the following variables:
     ```
     TODOIST_API_TOKEN=your_todoist_api_token_here
     BUILD_FILENAME=deployment-package
     AWS_LAMBDA_FUNCTION_NAME=todoist-scores
     ```
   - Alternatively, you can use the provided `.env.example` file as a starting point.
4. **Run the function locally**:
   - Use the provided script to invoke the Lambda handler locally:
     ```bash
     yarn local
     ```
5. **Deploy to AWS Lambda**:
   - **Build the deployment package**:
     ```bash
     yarn build
     ```
   - **Deploy the package**:
     ```bash
     yarn deploy
     ```
   - **Full Build and Deploy**:
     ```bash
     yarn deploy:full
     ```

## Additional Notes

- The scoring logic is based on labels attached to tasks. Any label ending with a dollar sign (`$`) followed by a number will contribute that number to the day's score. For example, if a completed task has the label `5$`, it will contribute a score of `5` to that day.
- The date calculations use the **luxon** library to ensure times are based on the Toronto time zone (`America/Toronto`) to meet the user's needs for consistent date ranges.
- **Logs** for debugging and API calls are included to assist in troubleshooting.

### Package Scripts

Here are the available scripts in `package.json` for convenience:

- **`yarn local`**: Runs the function locally using `local.mjs`.
- **`yarn build`**: Builds a `.zip` package using the filename defined in `.env` (`BUILD_FILENAME`).
- **`yarn deploy`**: Deploys the built package to AWS Lambda using the function name specified in `.env` (`AWS_LAMBDA_FUNCTION_NAME`).
- **`yarn deploy:full`**: Runs the build script and then deploys the resulting package.

### AI Assistance

- This project was largely generated with the help of an AI assistant to facilitate quick development and streamline the integration with Todoist and AWS Lambda.

Feel free to adjust the code to fit your specific needs. If you have any questions or need additional help, please let me know!
