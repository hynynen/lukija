var  mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
	user: 'tele',
	password: 'homonaama'
});
connection.query('USE tele');
connection.close;

exports.index = function (req, res){
	console.log('Ladataan etusivu');
	connection.query("SELECT * FROM Products",function (err, rows){
		if (err){
			console.log("Virhe haettaessa tuotteita tietokannasta");
			res.status(500).send("Virhe haettaessa tuotteita tietokannasta");
		} else {
			res.render('index', {title: 'Piikki-app',
products: rows, style: 'header.css'});
		}
	});
	connection.close;
};
