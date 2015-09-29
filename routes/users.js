var mysql = require('mysql'); // Otetaan moduuli käyttöön
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'tele',
    password: 'homonaama'
    database: 'tele'
});

exports.list = function(req, res){
    console.log('Listataan käyttäjät...');
    connection.query('SELECT * FROM Users', function(err,rows){
	res.send(rows);
    });
    connection.close;
//    res.send('ok');
};

exports.search = function(req, res) {

    var id = req.query.card_id;
    console.log('Etsitään id:tä ' + id);
    connection.query("SELECT * FROM Users WHERE opnro='"+id+"'", function(err, rows){
		if (err) {
			console.log('Virhe haettaessa käyttäjän tietoja kannasta');
			res.status(500).send('Virhe haettaessa käyttäjän tietoja kannasta');
		} else {
			console.log('Käyttäjähaku onnistui');
			res.status(200).send(JSON.stringify(rows));

    	}
    });
    connection.close;
}

exports.addUser = function(req, res) {
    console.log('Käyttäjän lisäysfunktio');
    var nick = req.body.nick;
    var id = req.body.id;
    var userdata = {name: nick, opnro: id};
    console.log('Nimimerkki: ' + nick + ', tunniste: '+ id);
    connection.query('INSERT INTO Users SET ?', userdata, function(err, rows){
	if (err){
	    console.log('Virhe käyttäjän lisäämisessä tietokantaan');
	    res.status(500).send('Virhe tietokantaan lisäämisessä');
	} else {
	    console.log('Käyttäjän lisäys onnistui');
	    res.redirect('/addUserView');
	}
    });
    connection.close;
}

exports.deleteUser = function(req, res) {
    console.log('Käyttäjä poistofunktio');
    var nick = req.body.nick;
    var id = req.body.id;
    var userdata = {name: nick, opnro: id};
    console.log('Nimimerkki: ' + nick + ', tunniste: '+ id);
    connection.query("DELETE FROM Users WHERE name='"+nick+"' AND opnro='"+id+"'", function(err, rows){
	if (err){
	    console.log('Virhe käyttäjän poistamisessa tietokannasta');
            res.status(500).send('Virhe tietokannasta poistamisessa');
	} else {
	    console.log('Käyttäjän poistaminen onnistui');
	    res.redirect('/');
	}
    });
    connection.close;
}

function checkCredit(user, product, callback){
	console.log('Tarkistetaan käyttäjän saldoa..');
	connection.query("SELECT hinta FROM Products WHERE id='"+product+"'", function(err, rows){
		if (err){
			console.log('Virhe haettaessa tuotteen tietoja kannasta');
			return true;
		} else {
			var price = rows[0].hinta;
			connection.query("SELECT credit FROM Users WHERE opnro='"+user+"'", 				function(err,rows){
				if (err){
					console.log('Virhe haettaessa käyttäjän saldoa');
					return true;
				} else {
					var credit = rows[0].credit;
					if (credit >= price){
						console.log('Saldo riittää!');
						callback(false);
					} else {
						console.log('Virhe: saldon tarkistus ei mennyt läpi');
						callback(true);
					}
				}
			});			
		}
	});
	connection.close;		
}

exports.buy = function(req, res){
	console.log('Veloitetaan tuotetta käyttäjältä');
	var user = req.body.user;
	var product = req.body.prodId;
	console.log('Käyttäjä: '+user+", tuote: "+product);
	checkCredit(user,product,function callback(result){
		if (result){
		console.log('VIRHE: Käyttäjällä ei ole tarpeeksi saldoa!');
		res.status(500).send('VIRHE: Käyttäjällä ei ole tarpeeksi saldoa!');
		} else {
			connection.query("SELECT hinta FROM Products WHERE id='"+product+"'", function(err, rows){
				if (err){	
					console.log('Virhe haettaessa tuotteen hintaa kannasta');
					res.status(500).send('Virhe haettaessa tuotteen hintaa kannasta');
				} else {
					var price = rows[0].hinta;
					connection.query("UPDATE Users SET credit=credit-"+price+" WHERE 					opnro="+user,function(err,rows){
						if (err){
							console.log('Virhe muuttaessa käyttäjän saldoa');
							res.status(500).send('Virhe muuttaessa käyttäjän saldoa');
						} else {
							console.log('Osto onnistui');
							res.status(200).send();
						}
					});				
				}
			});
		}
	});
	connection.close;
}

exports.addCredit = function(req, res){
	console.log('Lisätään käyttäjälle saldoa');
	var user = req.body.id;
	var credit = req.body.credit;
	console.log('Käyttäjä: '+user+' Lisätään: '+credit);
	connection.query("UPDATE Users SET credit=credit+"+credit+" WHERE opnro='"+user+"'", function(err,rows){
		if (err){
			console.log(err);
			console.log('Virhe käyttäjän saldon päivittämisessä');
			res.status(500).send('Virhe käyttäjän saldon päivittämisessä');
		} else {
			console.log('Saldon päivitys onnistui');
			res.redirect('/');
		}
	});
	connection.close;
}
