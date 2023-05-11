var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
  host: '34.121.38.212',
  user: 'trending54-1234',
  password: 'trending54-1234',
  database: 'Trending54'
});

connection.connect;

var app = express();

// set uyp ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '..public'));

app.get('/', function(reg,res) {
  res.render('index', { title: 'Group 54 DEMO'})
});

app.get('/success', function(req, res) {
  res.send({'message': 'query successful!'}); 
});

app.get('/login', function(req, res) {
  var email = req.body['login-email'];
  var password = req.body['login-password'];
console.log(email);
var sql = `SELECT emailAddress FROM Users WHERE emailAddress = '${email}' AND pwd = '${password}'`;

connection.query(sql, function(err, result) {
  if (err) {
    res.send(err);
    return;
  }
 
    res.redirect('/success');
  
})
});

app.post('/signup', function(req, res) {
    var firstName = req.body['first-name'];
    var lastName = req.body['last-name'];
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body['phone-number'];
    console.log(phone);
    console.log(firstName);
    console.log(req.body);

    var userID = Math.floor(Math.random() * 1000000); // generates a random number between 0 and 999999

    var sql = `INSERT INTO Users (userID, FirstName, LastName, emailAddress, pwd, phoneNumber) VALUES ('${userID}', '${firstName}', '${lastName}', '${email}', '${password}', '${phone}');`;

    connection.query(sql, function(err, result) {
        if (err) {
            var errorMessage = 'An error occurred while signing up. Please try again.';
            if (err.code === 'ER_DUP_ENTRY') {
                errorMessage = 'This email address is already in use.';
            }
            res.json({ error: errorMessage });
            return;
        }

        res.json({ firstName: firstName });
    })
});

app.post('/nickname', function(req, res) {
    var nickname = req.body.nickname;
    var name = req.body.name;
    var sql = `UPDATE Users SET FirstName = '${nickname}' WHERE FirstName = '${name}';`;
  
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
    
        res.redirect('/success');

    })
  });
  
  app.post('/delete-user', function(req, res) {
    var email = req.body.email;
    var sql = `DELETE FROM Users WHERE emailAddress = '${email}'`;
  
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
        res.redirect('/success');
    })
  });
  
  app.listen(80, function() {
  console.log(':');
  });

  app.get('/popular_video', function(req, res) {
    var sql = `SELECT channelID, title FROM YoutubeChannel JOIN Video USING(channelID) WHERE view_count > (SELECT totalViews/totalVideos FROM YoutubeChannel y WHERE y.channelID = YoutubeChannel.channelID);`;
  
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
  
      // Return the first (and likely only) result as JSON
      res.json(result[0]);
    });
  });

  app.get('/wealth_poorest', function(req, res) {

    var sql = `SELECT emailAddress, age FROM Users NATURAL JOIN Preferences WHERE averageIncome > 70000 UNION SELECT emailAddress, age FROM Users NATURAL JOIN Preferences WHERE averageIncome < 30000 LIMIT 15`;
  
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
  
      // Return the result as JSON
      res.json(result);
    });
  });

  app.get('/search', function(req, res) {
    var searchTerm = req.query['search-term'];
    var sql = `SELECT title FROM Video WHERE title LIKE '%${searchTerm}%'`;
  
    connection.query(sql, function(err, results) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(results);
    });
  });
  
  app.get('/wealth_poorest_top_videos', function(req, res) {
    var sql = `CALL PopularVideoAndViewers();`;

    connection.query(sql, function(err, result) {
        if (err) {
            res.send(err);
            return;
        }

        // Return the result as JSON
        res.json(result[0]);
    });
});
