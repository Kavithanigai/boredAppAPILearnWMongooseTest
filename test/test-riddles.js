'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;


const { Riddle } = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
function seedRiddleData() {
  console.info('seeding riddle data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateRiddleData());
  }
  // this will return a promise
  return Riddle.insertMany(seedData);
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generateRiddleData() {
  return {
      riddle: faker.lorem.sentence(),
      answer: faker.lorem.text()
    }
}

// this function deletes the entire database.
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Riddle API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRiddleData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // Test get
  describe('GET endpoint', function() {

    it('should return all existing riddles', function() {

     let res;
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
         res=_res;
         expect(res).to.be.json;
          expect(res).to.have.status(200);

          //check if atleast there is one blog post
          expect(res.body).to.have.length.of.at.least(1);
          return Riddle.count();
        })
        .then(function(count) {
          expect(res.body).to.have.length.of(count);
        });
    });

    it('should return riddles with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let riddlePosted;
      return chai.request(app)
        .get('/riddles')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(blog) {
            expect(blog).to.be.a('object');
            expect(blog).to.include.keys(
              'riddle', 'answer');
          });
          riddlePosted = res.body[0];
          return Riddle.findById(riddlePosted.id);
        })
        .then(function(riddleQ) {
          expect(riddlePosted.id).to.equal(riddleQ.id);
          expect(riddlePosted.riddle).to.equal(riddleQ.riddle);
          expect(riddlePosted.answer).to.equal(riddleQ.answer);
        });
    });
  });

  describe('POST endpoint', function() {
    // make a POST request with data
    it('should add a new riddle', function() {

      const newRiddle = generateRiddleData();

      return chai.request(app)
        .post('/riddles')
        .send(newRiddle)
        .then(function(res) {
         expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'riddle', 'answer');
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.riddle).to.equal(newRiddle.riddle);
          expect(res.body.answer).to.equal(newRiddle.answer);
          return Riddle.findById(res.body.id);
        })
        .then(function(riddleQ) {
          expect(riddleQ.riddle).to.equal(newRiddle.riddle);
          expect(riddleQ.answer).to.equal(newRiddle.answer);
        });
    });
  });

  describe('PUT endpoint', function() {
   // Make a PUT request to update the post
    it('should update fields you send over', function() {
      const updateData = {
        riddle: 'Recipe',
        answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      };

      return Riddle
        .findOne()
        .then(function(riddle) {
          updateData.id = riddle.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/riddles/${riddle.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Riddle.findById(updateData.id);
        })
        .then(function(riddleQ) {
          expect(riddleQ.riddle).to.equal(updateData.riddle);
          expect(riddleQ.answer).to.equal(updateData.answer);

        });
    });
  });

  describe('DELETE endpoint', function() {
   // DELETE a blog post with id
    it('delete a riddle by id', function() {
      let riddleQ;
      return Riddle
        .findOne()
        .then(function(_riddleQ) {
          riddleQ=_riddleQ;
         return chai.request(app).delete(`/riddles/${riddleQ.id}`);
        })
        .then(function(res) {
         expect(res).to.have.status(204);
          return Riddle.findById(riddleQ.id);
        })
        .then(function(_riddleQ) {
          expect(_riddleQ).to.be.null;

        });
    });
  });
});
