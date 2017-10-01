Repo contains a sample API implemented using the Node.js Restify and Mongoose frameworks. It is derived from what I learned taking the course "A Simple Node.js/Mongo/Restify API in Less Than 3 Hours" on Udemy in the fall of 2017.

To run the project you first need to clone the repo and install the dependencies.

I'm using a MongoDB database so you have to install that or setup a mLab account in the cloud and create a database.

Also, the project uses a .env file for assigning environment variables referred to in the configuration file. This file is not in the repo for security reasons. In the project root create a file named .env with the following settings:

```
NODE_ENV=development
port=8080
DB_HOST=localhost
DB_NAME=<databasename>
DB_USERNAME=<db username>
DB_PASSWORD=<db password>
```

