var express 	= require('express');
var WebSocket 	= require('ws');
var morgan 		= require('morgan');
var app 		= express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/views/index.html"); 
});

app.listen(3000, function () {
  console.log('MeeChat listening on port 3000');
});	
