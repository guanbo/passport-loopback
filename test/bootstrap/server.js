'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.token = Date.now().toString();
function auth(req, res, next) {
  if(!app.token) return res.sendStatus(401);
  if(app.token !== req.headers['authorization']) return res.sendStatus(403);
  next();
}
app.get('/me', auth, (req, res)=>{
  res.status(200).json({id:133});
});

let server;
before((done) => {
  server = app.listen(3000, (err)=>{
    console.log('Listen on http://localhost:'+server.address().port);
    done(err);
  });
});

after(() => {
  server.close();
});

module.exports = app;
