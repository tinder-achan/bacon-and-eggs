import express from 'express';

const app = express();

app.get('/', function(req, res){
  res.send('hello 🥓 & 🍳 & sad');
});

app.listen(process.env.PORT || 3000);
