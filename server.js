
'use strict';
//import express
const express= require('express');

//Log the http layer
const morgan = require('morgan');
const mongoose = require('mongoose');
	mongoose.Promise = global.Promise;

const {router:riddlesRouter}= require('./router/riddlesRouter');

const { PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');

//initialize app
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.use('/riddles', riddlesRouter);


let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

app.get('/toby', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/index.html');
});

/*
app.get('/riddles', (req, res) => {
    res.json(riddles.get());
});*/



module.exports = { runServer, app, closeServer };
