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

app.use(express.static('public'));

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

app.get('/marie', function(req, res){
	res.render("marie");
})

//UNDER CONTRUCTION TO MAKE DYNAMIC
app.get('/story', function(req, res){
	res.render("story");
})

app.get('/submit', function(req, res){
	res.render("submit");
})

app.get('/thankyou', function(req, res){
	res.render("thankyou");
})

//----------POSTGRES--------------------------------------
var connectionString = "postgres://Valerie@localhost/twerkbase";

//WRITING FORM INPUT IN POSTGRES DATABASE
app.post('/submit', function (req, res) {

	var iname = req.body.name;
	var iemail = req.body.email;
	var icoding = req.body.coding;
	var ijobinfo = req.body.jobinfo;
	var idaytoday = req.body.daytoday;
	var iproject = req.body.project;
	var itipps = req.body.tipps;
	var ipicture = req.body.picture;

	console.log('This is what I receive from the form: '+" "+iname+" "+iemail+" "+icoding+" "+ijobinfo+" "+idaytoday+" "+iproject+" "+itipps+" "+ipicture);

	pg.connect(connectionString, function (err, client, done){
		
		if(err){
			throw(err);
		}
		
		//INSERT USER INFO
		client.query(`INSERT INTO users 
					(name, email) 
					VALUES ($1, $2)`, 
					[iname, iemail], function(err, users){
			console.log("User info got inserted");
		});
		client.query(`SELECT * FROM users;`, function (err, users) {
			console.log("Current content of users db: "+users.rows);
		});
		
		//INSERT STORIES INFO
		client.query(`INSERT INTO stories 
					(coding, jobinfo, daytoday, project, tipps, picture) 
					VALUES ($1, $2, $3, $4, $5, $6)`,
					[icoding, ijobinfo, idaytoday, iproject, itipps, ipicture], function(err, stories){
			console.log("Story info got inserted");
		});
		client.query(`SELECT * FROM stories;`, function (err, stories){
			console.log("Current content of stories db: "+stories.rows);
		});

	pg.end();
	});
});


//SENDING DATABASE ENTRIES TO BE RENDERED IN PUG FILE
app.post('/story', function(req, res) {

	var name = req.body.name;
	console.log("This is the name I am working with: "+name);
	var userid = "";
	var dbstory = "";

	pg.connect(connectionString, function(err, client, done){

		client.query(`SELECT * FROM users WHERE name = '${name}'`, function (err, idcol){
			userid = idcol.id;
			console.log("This is the user ID I received from the database: "+userid);
			client.query(`SELECT * FROM stories WHERE id = '${userid}`, function (err, storycol){
				dbstory = JSON.stringify(storycol);
				console.log("This is story information I receive from the database: " +dbstory);
				done();
				res.render("story", {name:  name, paragraph: dbstory});
			});
			pg.end();
		});
	})
})

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});