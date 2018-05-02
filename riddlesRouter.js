//import express
const express = require('express');
const router = express.Router();

//json parser for post and update
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Riddles} = require('./models');

//Create initial Riddles
Riddles.create('What room do ghosts avoid?','The living room');
Riddles.create('What has many keys, but cannot even open a single door?','A piano');

//Send Json for all Riddles
router.get('/',(req,res) =>{
  res.json(Riddles.get());
});

//Add a new riddle
router.post('/', jsonParser, (req,res) =>{
  const reqFields = ['riddleQues', 'answer'];
for(let i=0; i<reqFields.length; i++)
{
  const field = reqFields[i];
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }

}
const riddle = Riddles.create(req.body.riddleQues, req.body.answer);
res.status(201).json(riddle);
});


//Delete a riddles by id
router.delete('/:id', (req,res) =>{
  Riddles.delete(req.params.id);
  console.log(`Deleted riddle \`${req.params.ID}\``);
  res.status(204).end();
});

//Update a riddle
router.put('/:id', jsonParser, (req,res) =>{
  const reqFields=['riddleQues','answer','id'];
  for(let i=0; i<reqFields.length; i++)
  {
    const field = reqFields[i];
    if(!(field in req.body))
    {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if(req.params.id !== req.body.id){
    const message = ` Request path id (${req.params.is}) and request body id (${req.body.id}) doesnot match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating riddle ${req.params.id}`);
  const updatedriddle=Riddles.update({
    id: req.params.id,
    riddleQues: req.body.riddleQues,
    answer: req.body.answer
  });
  res.status(204).end();
});

module.exports = router;
