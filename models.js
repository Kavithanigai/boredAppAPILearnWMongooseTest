const uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const Riddles = {
  create: function(riddleQues,answer) {
    const riddle = {
      id: uuid.v4(),
      riddleQues: riddleQues,
      answer: answer
    };
    this.riddles.push(riddle);
    return riddle;
  },
  get: function(){
    console.log('Retrieving riddles');
    return Object.keys(this.riddles).map(key => this.riddles[key]);
  },
  delete: function(id) {
    const riddleIndex = this.riddles.findIndex(
      riddle => riddle.id === id);
    if (riddleIndex > -1) {
      this.riddles.splice(riddleIndex, 1);
    }
  },
  update: function(updatedriddle) {
    const {id} = updatedriddle;
    const riddleIndex = this.riddles.findIndex(
      riddle => riddle.id === updatedriddle.id);
    if (riddleIndex === -1) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.riddles[riddleIndex] = Object.assign(
      this.riddles[riddleIndex], updatedriddle);
    return this.riddles[riddleIndex];
  }
};

function createRiddlesModel() {
  const storage = Object.create(Riddles);
  storage.riddles = [];
  return storage;
}

module.exports = {Riddles: createRiddlesModel()};
