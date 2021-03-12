# Aurora

Updated code for [CovEducation](https://www.coved.org). 


## Setup

You will need [lerna](https://lerna.js.org/) and [yarn](https://yarnpkg.com/) to use this monorepo. After installing them,

1. Install the dependencies:
    ```sh
    foo@bar:~/Aurora$ yarn
    ```
2. Compile the packages
    ```sh
    foo@bar:~/Aurora$ lerna run build
    ```
To setup the environment, you will need 2 things, the .env file containing all the environmental variables needed to run the server and the service_account.json file for firebase authentication. Reach out to the dev team over slack for these files. 

## Development 

For development, you can have a hotloader for both the frontend and backend by starting the hotloaders in different terminals:

1. In terminal one, cd into packages/server and start the dev server. The React hotloader expects the server to be at port 8080, so we can initialize it as follows:
    ```sh
    foo@bar~/Aurora: cd packages/server
    foo@bar~/Aurora/packages/server: PORT=8080 lerna run dev --stream
    ```
3. In terminal twok cd into packages/client and run the react hotloader:
    ```sh
    foo@bar~/Aurora: cd packages/client
    foo@bar~/Aurora/packages/client: yarn start
    ```
## Testing 

The test suite can be ran with:   
```sh
foo@bar~/Aurora: lerna run test --stream  
```

If you want to only run backend tests, you can use lerna's scope option:
```sh
foo@bar~/Aurora: lerna run test --stream  --scope = "@coved/server"
```

**NOTE Do not run the testing suite with production credentails. Since we automatically sync our algolia index with new mongoose models, running the testing suite will create hundreds of testing accounts that will clutter the mentor database. **
