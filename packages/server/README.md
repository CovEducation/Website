# Express Server Setup

This repository serves as the skeleton for the backend side of a Express server. The repository features middleware validation, unit and e2e testing, and MongoDB data storage. 


## Architecture

The server is divided into:
 - services: 
   - Each service is in charge of implementing the logic for the actual functionality. It can use models to talk to the database. It should not deal with routing, status codes, or error messages.
 - routes: 
   - Deal with routing a request and retriving the parameters to make the appropriate service calls. For each route, we create a router in charge of a specific endpoint (`/messages`, `/users`, etc.). Each route handler has the following subcomponents:
     - interfaces
         - Defines the request and response interfaces for every REST endpoint.
     - validation
         - Describes the parameter validation for each endpoint. To be used with the middleware validation in [validator.ts](src/middleware/validation/validator.ts)
     - handlers
       - Handle the actual server request. Each handler makes the appropriate service calls and returns the appropriate status code / error messsage.
 - middleware
   - Middleware to be used throughout the server. The main use case is validating the server request through [validator.ts](src/middleware/validation/validator.ts).
 - models
   - Describe the data models and interface to interact with the database. It uses typegoose to provide type-safe document access. 
