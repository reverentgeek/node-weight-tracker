# Build a Weight Tracker App with Node.js and PostgreSQL

Did you make any resolutions this year? One resolution I seem to make *every* year is to lose weight and exercise. Sometimes I stick to it.

A good way I have found to keep on track with any resolution is to record progress. There's something about visualizing progress that helps me stay motivated.

In this tutorial, you are going to create a modern Node.js application to keep track weight measurements. The technologies you're going to use include PostgreSQL, a new and exciting Postgres client for Node.js, hapi, Vue.js, and Okta to provide account registration and login, and to secure the API!

Before we begin, let's first check some requirements.

* [Node.js](https://nodejs.org/) 12.x or higher
* [PostgreSQL](https://www.postgresql.org/): This can be installed locally using Docker. More details on this later in the tutorial!
* [Free Okta developer account](https://developer.okta.com/): For account registration, login, and security

## Create Your Node.js Project

Open up your terminal or command prompt. Change to the folder where you store projects, and create a new folder for this project.

```sh
mkdir node-weight-tracker
cd node-weight-tracker
```

Next, use `npm` to initialize the project's `package.json` file.

```sh
npm init -y
```

In this tutorial, we are using [hapi](https://hapi.dev), a wonderful application framework that supports all the latest features of Node.js and the JavaScript language. Here is an overview of the modules you will use in this project.

|Module|Description|
|:---|:---|
|hapi|Web application framework for Node.js|
|bell|Hapi plugin to support third-party logins|
|boom|Hapi plugin for HTTP errors|
|cookie|Hapi plugin for cookie-based authentication|
|inert|Hapi plugin for serving static files|
|joi|Hapi plugin for validating request and response data|
|vision|Hapi plugin for rendering server-side templates|
|dotenv|A module to manage configuration using environment variables|
|ejs|A template engine that uses JavaScript|
|postgres|A PostgreSQL client|
|nodemon|Monitors file changes and automatically restarts the server (for development only and not to be used in production)|

Install all the project dependencies using the following `npm` commands. It's important to note these commands install specific versions available at the time of this writing.

```sh
npm install @hapi/hapi@19 @hapi/bell@12 @hapi/boom@9 @hapi/cookie@11 @hapi/inert@6 @hapi/joi@17 @hapi/vision@6 dotenv@8 ejs@3 postgres@1

npm install --save-dev nodemon@2
```

Now open the project in your editor of choice.

> If you don't already have a favorite code editor, I recommend installing [Visual Studio Code](https://code.visualstudio.com/). VS Code has exceptional support for JavaScript and Node.js, such as smart code completion and debugging. There's also a vast library of free extensions contributed by the community.

Create a new file named `.env` in the root of the project and add the following configuration.

```sh
# Host configuration
PORT=8080
HOST=localhost
```

Next, create a folder in the project named `src`. In the `src` folder, create folders named `assets`, `plugins`, `routes`, and `templates`. We will use each of these folders in the future to organize code. Your project should currently look something like the following.

```sh
> node_modules
> src
   > assets
   > plugins
   > routes
   > templates
.env
package-lock.json
package.json
```

### Create a "hello world" web app using hapi

In the `src` folder, create a new file named `index.js`. Add the following code to this file.

```js
"use strict";

const dotenv = require( "dotenv" );
const Hapi = require( "@hapi/hapi" );

const routes = require( "./routes" );

const createServer = async () => {
  const server = Hapi.server( {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost"
  } );

  server.route( routes );

  return server;
};

const init = async () => {
  dotenv.config();
  const server = await createServer();
  await server.start();
  console.log( "Server running on %s", server.info.uri );
};

process.on( "unhandledRejection", ( err ) => {
  console.log( err );
  process.exit( 1 );
} );

init();
```

In the previous code, the `init()` function uses `dotenv` to read in the `.env` configuration file, creates the web server, starts the server, and outputs the address of the web server. The `createServer()` function creates an instance of the hapi server based on the `port` and `host` values in the `.env` configuration file. It then registers the routes defined in the `routes` module. There's also an event handler defined for `unhandledRejection` in case an exception occurs anywhere in the application that doesn't have error handling, which outputs the error and shuts down the server.

Next you need to define at least one route for the `routes` module. Create a new file in the `src/routes` folder named `index.js`. Add the following code to this file.

```js
"use strict";

const home = {
  method: "GET",
  path: "/",
  handler: ( request, h ) => {
    return "hello world!";
  }
};

module.exports = [ home ];
```

The previous code defines one route, `home`, which returns the text "hello world!" The module is designed to export an array, as you will be adding more routes to this module later.

Open the `package.json` file and find the `scripts` section. Add the following script to this section.

```js
    "dev": "nodemon --watch src -e ejs,js src/index.js",
```

Now, go to the command line and type the following command to start the development web server.

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:8080`. You should see your "hello world!" message.

Go back to the `src/routes/index.js` file and make a change to the "hello world!" message and save the file. You should see `nodemon` automatically detect the change and restart the server. Refresh the browser and you should see that change reflected. You are on your way to developing a _happy_ little web application!

## Create a PostgreSQL Server with Docker

> Note: If you already have an instance of PostgreSQL you can work with, great! You can skip ahead to the next section.

We are going to use PostgreSQL to store weight measurements. However, installing server software like PostgreSQL on a development machine is no trivial task. That's where Docker comes in! If you don't already have Docker installed, follow the [install guide](https://docs.docker.com/install/#supported-platforms) and then come back.

With Docker installed, run the following command to download the latest PostgreSQL container.

```sh
docker pull postgres:latest
```

Next, create an instance of a PostgreSQL database server. Feel free to change the administrator password value.

```sh
docker run -d --name measurements -p 5432:5432 -e 'POSTGRES_PASSWORD=p@ssw0rd42' postgres
```

Here is a quick explanation of the previous Docker parameters.

|Parameter|Description|
|:---|:---|
|-d|This launches the container in daemon mode, so it runs in the background.|
|--name|This gives your Docker container a friendly name|
|-p|This maps a TCP port on the host (your computer) to a port in the container. By default, PostgreSQL uses port 5432 for connections.|
|-e|This sets an environment variable in the container.|
|postgres|This final parameter tells Docker to use the postgres image.|

> Note: If you restart your computer, may need to restart the Docker container. You can do that from the command line using the following command: `docker start measurements`.

## Add PostgreSQL Configuration

Add the following settings to the end of the `.env` file.

```sh
# Postgres configuration
PGHOST=localhost
PGUSERNAME=postgres
PGDATABASE=postgres
PGPASSWORD=p@ssw0rd42
PGPORT=5432
```

Note: If you changed the database administrator password, or you have different credentials for an existing server, be sure to update the values to match your specific environment.

## Add a PostgreSQL Database Build Script

In order to use a database, you need a way to initialize it with any tables and other schema, initial data, and so forth. One way to do that is to create a script. Here you'll use Node.js to execute a build script that will create the schema needed for the application.

Next, create a folder in the root of the project named `tools`. In this folder, create a new file named `initdb.js` and add the following code.

```js
"use strict";

const dotenv = require( "dotenv" );
const postgres = require( "postgres" );

const init = async () => {
  // read environment variables
  dotenv.config();
  
  try {
    // connect to the local database server
    const sql = postgres();

    console.log( "dropping table, if exists..." );
    await sql`DROP TABLE IF EXISTS measurements`;

    console.log( "creating table..." );
    await sql`CREATE TABLE IF NOT EXISTS measurements (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
      , user_id varchar(50) NOT NULL
      , measure_date date NOT NULL
      , weight numeric(5,1) NOT NULL
    )`;

    await sql.end();
  } catch ( err ) {
    console.log( err );
    throw err;
  }
};

init().then( () => {
  console.log( "finished" );
} ).catch( () => {
  console.log( "finished with errors" );
} );
```

Next, update the `scripts` section in the `package.json` file to include the following command.

```js
    "initdb": "node tools/initdb.js",
```

Now, you can run the build script at the command line with the following command.

```sh
npm run initdb
```

You should see the message `finished` at the console. A new table named `measurements` is now in your database! Any time you want to reset your database, just rerun the script.
