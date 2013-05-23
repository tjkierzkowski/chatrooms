var http = require('http');
var fs = require ('fs');
var path = require('path');
var mime = require ('mime');
var listen_port = 3000;
var cache = {};

/*function to manage Error Responses*/
function send404(response){
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

/*function to send file data*/
function sendFile(response, filePath, fileContents){
	response.writeHead(
		200, 
		{"content-type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

/*function to Server static files, determining if they are cached or on disk. Returns a 404 response if the file is not found*/
function serveStatic(response, cache, absPath){
	if (cache[absPath])	{
		sendFile(response, absPath, cache[absPath]);
	} else{
		fs.exists(absPath, function(exists) {
			if (exists){
				fs.readFile(absPath, function(err, data) {
					if(err){
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

/*The main server function which handles the html serve pages*/
var server = http.createServer(function(request, response){
	var filePath = false;

	if (request.url == '/')	{
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}

	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

/*evoking the server at port 3000*/
server.listen(listen_port, function()	{
	console.log("Server listening on port " + listen_port + ".");
});

/*create the chat server*/
var chatServer = require('./lib/chat_server');
chat_server.listen(server);



