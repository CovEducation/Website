# Lerna TypeScript Template

Bootstrap application using Lerna as a mono repo with yarn work-spaces. Includes a Node TS package(s) and a front-end package using React TypeScript.


## Setup

You will need [lerna](https://lerna.js.org/) and [yarn](https://yarnpkg.com/) to use this monorepo. After installing them,

1. Install the dependencies:
    ```sh
    foo@bar:~$ yarn
    ```
2. Compile the packages
    ```sh
    foo@bar:~$ lerna run build
    ```
3. Start the server and webpack hotloader
    ```sh
    foo@bar:~$ lerna run start --stream
    ```
4. Use live updating on the server side (in another terminal)
    ```sh
    foo@bar:~$ lerna run dev --stream
    ```
The frontend is setup to proxy all requests from '/api' to the server (it strips the '/api' prefix). Note that for a production build, after building the backend and frontend code, you only have to start the server:

```sh
foo@bar:~$ lerna run start --scope "@johanc/server" --stream
```