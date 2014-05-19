var express = require('express');
var app = express();

app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/styles"));
app.use(express.static(__dirname + "/node_modules"));

app.set("views", __dirname + "/html");

app.get('/hello.txt', function(req, res){
	res.sendfile(__dirname + '/html/task.html');
});

var server = app.listen(3000, function() {
	console.log("server start");
});

