var  mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'tele',
    password: 'homonaama',
    database: 'tele'
});

exports.index = function (req, res){
	console.log('Ladataan tuotesivua');
	connection.query("SELECT * FROM Products",function (err, rows){
		if (err){
			console.log("Virhe haettaessa tuotteita tietokannasta");
			res.status(500).send("Virhe haettaessa tuotteita tietokannasta");
		} else {
			res.render('addProduct', {title: 'Piikki-app',
products: rows, style: 'header.css'});
		}
	});
	connection.close;
};

exports.deleteProduct = function (req, res){
    console.log('Poistetaan tuotetta...');
    var product = req.body.prodID;
    console.log('Tuotenro: '+product);
    connection.query("DELETE FROM Products WHERE id='"+product+"'",function (err, rows){
	if (err) {
	    console.log('Virhe tuotteen poistamisessa kannasta');
	    res.status(500).send('Virhe tuotteen poistamisessa kannasta');
	} else {
	    console.log('Tuotteen poistaminen onnistui');
	    res.redirect('/addProductView');
	}
    });
    connection.close;
}

exports.add = function (req, res){
    console.log('Lisätään tuotetta...');
    var prod_id = req.body.barcode;
    var unparced_price = req.body.price;
    var price = unparced_price.replace(",",".");
    var name = req.body.name;
    var data = { nimi:name, hinta:price, id:prod_id, myyty:0};
    connection.query('INSERT INTO Products SET ?', data, function (err, rows){
	if (err){
	    console.log('Virhe tietokantaan lisäämisessä');
	    res.status(500).send('Virhe tietokantaan lisäämisessä');
	} else {
	    console.log('Tuotteen lisäys onnistui');
	    res.redirect('/addProductView');
	}
    });
    connection.close;
}
