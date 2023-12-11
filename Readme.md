docker run -it --name cypress -p 2200:22 -d cypress-container 

The command you've selected is already set up to run Cypress test cases inside a Docker container. Here's a breakdown of what it does:

`docker run -it -v "%cd%":/e2e -w /e2e 8fcbd64a96ab npx cypress run cypress/e2e/*.ts --browser electron`

docker run -it: This starts a new Docker container in interactive mode.
-v "%cd%":/e2e: This mounts the current directory (%cd% in Windows command prompt) from the host to the /e2e directory in the Docker container.
-w /e2e: This sets the working directory inside the Docker container to /e2e.
8fcbd64a96ab: This is the ID of the Docker image you want to run.
npx cypress run cypress/e2e/*.ts --browser electron: This is the command that will be run inside the Docker container. It runs Cypress tests located in the cypress/e2e directory using the Electron browser.
To run this command, open a command prompt, navigate to the directory containing your project, and then run the command. Make sure to replace 8fcbd64a96ab with the ID or name of your actual Docker image.

ducker run -it --entrypoint=cypress info

docker exec -it cypress-container npm run cy:run