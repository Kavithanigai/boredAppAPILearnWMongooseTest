
'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//const {Riddle} = require('./models');
//const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {Riddle} = require('../models');

const { DATABASE_URL, PORT } = require('../config');


//Get Request
router.get('/', (req, res) => {
  Riddle
    .find()
    .then(riddles => {
      res.json(riddles.map(riddle => riddle.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

//Get a riddle with id
router.get('/riddles/:id', (req, res) => {
  Riddle
    .findById(req.params.id)
    .then(riddle => res.json(riddle.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

//post a new riddle
router.post('/riddles', jsonParser, (req, res) => {
  const requiredFields = ['riddle', 'answer'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Riddle
    .create({
      riddle: req.body.riddle,
      answer: req.body.answer
    })
    .then(riddle => res.status(201).json(riddle.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});

//Delete a riddle
router.delete('/riddles/:id', (req, res) => {
  Riddle
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

//Update a riddle with id
router.put('/riddles/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['riddle', 'answer'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  Riddle
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedRiddle => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


router.delete('/:id', (req, res) => {
  Riddle
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


module.exports={router};
