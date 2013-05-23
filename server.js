var http = require('http');
var fs = require ('fs');
var path = require('path');
var mime = require ('mime');
var cache = {};

/*function to manage Error Responses*/
function send404(reponse){
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
