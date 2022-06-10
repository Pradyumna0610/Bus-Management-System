var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

var db = new sqlite3.Database('./database/BusManagement.db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./webpages')));
app.use(helmet());
app.use(limiter);

db.run('CREATE TABLE IF NOT EXISTS BusDetails(Bname TEXT, Bno TEXT, Bseats TEXT, Bfare TEXT, Bsource TEXT, Bdestination TEXT, Bdriver Text)');
db.run('CREATE TABLE IF NOT EXISTS Station(Sname TEXT, Scode TEXT)');
db.run('CREATE TABLE IF NOT EXISTS Emp(Ename TEXT,Eid TEXT,Emobile TEXT,Eposition TEXT)');
db.run('CREATE TABLE IF NOT EXISTS Ticket(TFrom TEXT,TTo TEXT,TDate DATE,BusNo TEXT, Tfare TEXT, PName TEXT, PAge TEXT, PGender gender)');
db.run('CREATE TABLE IF NOT EXISTS Signup(Fname TEXT, Lname TEXT, Username Text,Emailid TEXT, Password TEXT )');
db.run('CREATE TABLE IF NOT EXISTS Login(USername TEXT, Password TEXT)');

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./webpages/busdetails.html'));
});

app.post('/addBus', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO BusDetails(Bname, Bno , Bseats , Bfare , Bsource , Bdestination , Bdriver ) VALUES(?,?,?,?,?,?,?)', [req.body.Bname, req.body.Bno, req.body.seats, req.body.Fare, req.body.Source, req.body.Destination, req.body.Driver], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New employee has been added");
      res.send("Bus details added");
    });
});
});

app.post('/addStation', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO Station(Sname, Scode ) VALUES(?,?)', [req.body.Sname, req.body.Scode], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New Station has been added");
      res.send("Station details added");
    });
});
});

app.post('/addEmp', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO Station(Ename, Eid, Emobile,Eposition ) VALUES(?,?,?,?)', [req.body.name, req.body.Eid,req.body.Emobile,req.body.Eposition ], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New Employee has been added");
      res.send("Employee details added");
    });
});
});

app.post('/BookTicket', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO Ticekt(TFrom, TTo, Tdate , BusNo , TFare, PName, PAge, Pgender) VALUES(?,?,?,?,?,?,?,?)', [req.body.TFrom, req.body.TTo, req.body.TDate, req.body.BusNo, req.body.TFare, req.body.PName, req.body.PAge, req.body.Pgender], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New ticket generated");
      res.send("Ticket Booked");
    });
});
});

app.post('/Signup', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO Signup(Fname, Lname,Username, Emailid , Password) VALUES(?,?,?,?,?)', [req.body.Fname, req.body.Lname, req.body.Username, req.body.Emailid, req.body.Password], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New user registerd");
      res.send("User Registerd");
    });
});
});

app.post('/login', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO Login(Username, Password ) VALUES(?,?)', [req.body.Username, req.body.Password], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("User login Succesful");
      res.send("User logged in");
    });
});
});


app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});


server.listen(3000,function(){ 
    console.log("Server listening on port: 3000");
})