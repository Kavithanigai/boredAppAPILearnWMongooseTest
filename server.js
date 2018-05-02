//Import express- a minimalist web framework for nodeJS
const express = require('express');

//Import morgan to log HTTP layer
const morgan = require('morgan');

const riddlesRouter = require('./riddlesRouter');
//Intialize app
const app = express();

app.use(morgan('common'));


// you need to import `blogPostsRouter` router and route
// requests to HTTP requests to `/blog-posts` to `blogPostsRouter`
app.use('/riddles', riddlesRouter);

//create a server object for running and closing runServer
let server;

//starting server
function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise((resolve,reject) =>{
    server = app.listen(port,() =>{
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err =>{
      reject(err);
    });
    });
}

//Closing server
function closeServer(){
  return new Promise((resolve,reject) =>{
      console.log('Closing Server');
      server.close(err =>{
      if(err){
        reject(err);
        return;
      }
      resolve();
      });
  });
}


//if server is called directly with node server.js the following block works
if(require.main === module){
  runServer().catch(err => console.error(err));
}

//we also export the runServer command so other code like test code) can start the server as needed.

module.exports = {app,runServer, closeServer};
