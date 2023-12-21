docker run -it --name cypress -p 2200:22 -d cypress-container 

# Cypress Testing in Docker

This guide explains how to run Cypress test cases inside a Docker container.

## Running Tests

Use the following command to start a new Docker container and run the tests:

```bash
docker run -it -v "%cd%":/e2e -w /e2e 8fcbd64a96ab npx cypress run cypress/e2e/*.ts --browser electron
```

dHere's a breakdown of what this command does:

docker run -it: Starts a new Docker container in interactive mode.
-v "%cd%":/e2e: Mounts the current directory (%cd% in Windows command prompt) from the host to the /e2e directory in the Docker container.
-w /e2e: Sets the working directory inside the Docker container to /e2e.
8fcbd64a96ab: The ID of the Docker image you want to run.
npx cypress run cypress/e2e/*.ts --browser electron: The command that will be run inside the Docker container. It runs Cypress tests located in the cypress/e2e directory using the Electron browser.
To run this command, open a command prompt, navigate to the directory containing your project, and then run the command. Make sure to replace 8fcbd64a96ab with the ID or name of your actual Docker image.

Additional Commands
To get Cypress info:

- To get Cypress info:
```bash
docker run -it --entrypoint=cypress info
```

- To execute Cypress tests:
```bash
docker exec -it cypress-container npm run cy:run
```

Generating Reports
After generating test result data and screenshots, you can generate a report. Follow these steps:

Add the allure-commandline dependency:
```bash
npm install allure-commandline --save-dev
```

Run your tests and generate test result data (ie, after running it will generate allure-results folder).
From the same project directory run, `allure generate allure-results --clean -o allure-report` in the command prompt
On successfull execution it will generate one more folder allure-reportin your directory.
Open index.html file in FireFox to show the report.
Note : If the report is in loading state, please try to open in different browsers

- Here is the step to generate Allure testing report

step 1:
```bash
npx cypress run --browser chrome --headless --env allure=true
``` 
step 2:
```bash
 allure generate allure-results --clean -o allure-report
 ```

 step 3:
 ```bash
 allure open
 ```