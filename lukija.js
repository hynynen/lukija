// Moduulien riippuvuudet

var express = require('express');
var app = express();
var http = require('http');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser'); //POST-metodin käsittelyyn
app.set('port', 80);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'stylesheets')));
app.use(bodyParser.json()); //POST
app.use(bodyParser.urlencoded({extended: true})); //POST
var index = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var mysql = require ('mysql');

// Funktiot, joissa käpistellään käyttäjän tietoja
app.get('/', index.index);
app.get('/users', users.list);
app.get('/users/search', users.search);
app.post('/users/buy', users.buy);
app.post('/users/addUser', users.addUser);
app.post('/users/deleteUser', users.deleteUser);
app.post('/users/addCredit', users.addCredit);

// Seuraavat funktiot on niin lyhyitä, etten tee niistä
// omaa tiedostoaan. Ne palauttavat vain sivun.
app.get('/deleteUserView', function(req,res){
    console.log('Ladataan käyttäjän poistaminen');
    res.render('deleteUser', {title: 'Piikki-app', style: 'header.css'});
});
app.get('/addUserView', function(req,res){
    console.log('Ladataan uuden käyttäjän lisäys');
    res.render('addUser', {title: 'Piikki-app', style: 'header.css'});
});
app.get('/addCreditView', function(req, res){
	console.log('Ladataan saldon lisäys');
	res.render('addCredit',{title: 'Piikki-app', style: 'header.css'});
});
app.get('/ok', function(req,res){
	console.log('Ladataan OK-sivu');
	res.send('OK');
});

// Funktiot, joissa käpistellään tuotteiden tietoja
app.get('/addProductView', products.index);
app.post('/products/addProducts', products.add);
app.post('/products/deleteProducts', products.deleteProduct);

setInterval(function(){
    var connection = mysql.createConnection({
	host: 'localhost',
	user: 'tele',
	password: 'homonaama',
	database: 'tele'
    });
    connection.query('SELECT 1');
    connection.end();
}, 10000);

// Alustetaan serveri
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' +app.get('port'));
});
