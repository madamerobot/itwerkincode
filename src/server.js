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
app.set('views', './views');
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

// // //----------POSTGRES--------------------------------------
var connectionString = "postgres://Valerie@localhost/twerkbase";
var messagecontent = "";

app.post('/submit', function (req, res) {

	var ifirst_name = req.body.first_name;
	var ilast_name = req.body.last_name;
	var iemail = req.body.email;

	console.log('This is what I receive from the form: '+" "+req.body.first_name); //does not work, returns undefined

	pg.connect(connectionString, function (err, client, done){
		if(err){
			throw(err);
		}
		client.query(`insert into twerkbase
			(first_name, last_name, email, coding, jobinfo, daytoday, project, tipps, picture) 
			values 
			(ifirst_name, ilast_name, iemail, icoding, ijobinfo, idaytoday, iproject, itipps, ipicture);`, function (err, result){
			console.log("Input was written to database");
			done();
		});

		client.query(`select * from twerkbase;`, function (err, result) {
			result.rows = messageContent;
			console.log(messageContent);
			done();
		});
	pg.end();
	});
});

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('http://localhost:' + server.address().port);
});