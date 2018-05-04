'use strict';

const uuid = require('uuid');
const mongoose = require('mongoose');

//Schema for riddles
const riddlesSchema = mongoose.Schema({
      riddle: {type: String, required: true},
      answer: {type: String, required: true}
});


//instance method for riddlesSchema to get only some fields
riddlesSchema.methods.serialize  = function(){
  return {
    id: this.id,
    riddle: this.riddle,
    answer: this.answer
  };
};

const Riddle = mongoose.model('Riddle', riddlesSchema);
module.exports = {Riddle};
