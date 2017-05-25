//---------CONFIG AND LIBRARIES-----------------

//Requiring express library
const express = require('express')
//Initialising express library
const app = express()

//Requiring file system library
const fs = require('fs');

//Requiring body parser library
//This adds a body property to the request parameter of every app.get and app.post
const bodyParser = require('body-parser');
//Initialising body-parser library
app.use('/', bodyParser())
app.use(bodyParser.urlencoded({
	extended: false
}))

//Setting PUG view engine
app.set('views', '././views');
app.set('view engine', 'pug');

//Requiring postgres library
const pg = require('pg')

//ROUTE USERS: RENDERS PAGE WITH ALL USERS FROM DATABASE

app.get('/', function(req, res){
	res.render("index");
})

app.get('/about', function(req, res){
	res.render("about");
})

app.get('/members', function(req, res){
	res.render("members");
})

app.get('/story', function(req, res){
	res.render("story");
})

app.get('/submit', function(req, res){
	res.render("submit");
})

//----------POSTGRES--------------------------------------
var connectionString = "postgres://process.env.jan:mypassword@localhost/twerkbase";
var messagecontent = "";

pg.connect(connectionString, function (err, client, done){
    client.query('insert into messages (title, body) values (titletext, bodytext);', function (err, result){
    console.log("Message was written in database");
    done();
    });

    client.query('select * from messages;', function (err, result) {
    messagecontent = result.rows;
    console.log(messagecontent);
    done();
    });
    pg.end();
});


//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('http://localhost:' + server.address().port);
});