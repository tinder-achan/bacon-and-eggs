import express from 'express';

const app = express();

app.get('/', function(req, res){
  res.send('hello 🥓 & 🍳 & sad');
});

app.listen(3000);
