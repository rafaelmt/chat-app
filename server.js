var express 	= require('express');
var WebSocket 	= require('ws');
var morgan 		= require('morgan');
var rest 		= require('restler');
var app 		= express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/views/index.html"); 
});

app.get('/avatar', function (req, res) {
	if(req.query) {
		getAvatar(req.query.name, function(imageUrl){
			if(imageUrl) {
				res.setHeader('content-type', 'application/json');
				res.send({url: imageUrl});
			} else {
				res.send();
			}
		});
	} else {
		res.send();
	}
});

app.listen(3000, function () {
  console.log('MeeChat listening on port 3000');
});	


function getAvatar(name, callback) {
	var encodedName = encodeURIComponent(name);
	var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=' + encodedName;
	rest.get(searchUrl).on('complete', function(data) {
		var url = parseResponse(data);
		callback(url);
	});
}

function parseResponse(jsonObj) {
	var imageUrl;
	if(jsonObj.query) {
		var pageId = Object.keys(jsonObj.query.pages);
		if(pageId && jsonObj.query.pages[pageId].thumbnail) {
			imageUrl = jsonObj.query.pages[pageId].thumbnail.original;
		}
	}
	return imageUrl;
}