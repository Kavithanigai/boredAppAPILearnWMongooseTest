//testing framework
const chai = require('chai');
//for integration testing
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

//to add expect syntax to tests
const expect = chai.expect;
chai.use(chaiHttp);

describe('Riddles', function(){
  //start the server first
  before(function(){
    return runServer();
  });

  //close the runServer
  after(function(){
    return closeServer();
  });

  it('To get existing riddles', function(){
    return chai.request(app)
    .get('/riddles')
    .then(function(res){
      expect(res).to.be.json;
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');

      //check if there is atleast one riddle
      expect(res.body.length).to.be.at.least(1);

      const expectedKeys =['riddleQues','answer'];
      res.body.forEach(function(riddle){
        expect(riddle).to.be.a('object');
        expect(riddle).to.include.keys(expectedKeys);
       });
     });
   });

   it('To include new posted riddles', function(){
     const newRiddle = {riddleQues: 'How do you spell candy in 2 letters ?',answer:'c and y c(and)y.'};

     return chai.request(app)
     .post('/riddles')
     .send(newRiddle)
     .then(function(res){
       expect(res).to.be.json;
       expect(res).to.have.status(201);
       expect(res.body).to.be.a('object');
       expect(res.body).to.include.keys('riddleQues', 'answer');
       expect(res.body.id).to.not.equal(null);

       // response should be deep equal to `newBlogItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newRiddle, {id: res.body.id}));
       });
    });

   it('To update a existing riddle through PUT', function(){
     const updatedRiddle = { riddleQues: 'How do you spell candy in 2 letters ?',answer:'c,y c(and)y.'};
     return chai.request(app)
     //get id first and then updated
     .get('/riddles')
     .then(function(res){
       updatedRiddle.id = res.body[0].id;
       return chai.request(app)
       .put(`/riddles/${updatedRiddle.id}`)
       .send(updatedRiddle);
      })
     .then(function(res){
      expect(res).to.have.status(204);
     });
   });

  it('To delete riddles thorugh DELETE', function(){
    return chai.request(app)
    //get id to delete that blog
    .get('/riddles')
    .then(function(res){
      return chai.request(app)
      .delete(`/riddles/${res.body[0].id}`);
      })
    .then(function(res){
      expect(res).to.have.status(204);
     });
   });

});
