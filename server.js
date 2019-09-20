var http = require('http');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
let error;
let user;

var express = require("express");
var app = express();

// oracledb.getConnection({

// user: 'nodeuser',
// password: 'MyATPdatabase123#',
// connectString: 'nodeappdb_high'
// },
oracledb.getConnection({
user: dbConfig.dbuser,
password: dbConfig.dbpassword,
connectString: dbConfig.connectString
},
function(err, connection) {
if (err) {
error = err;
return;
}
connection.execute('select user from dual', [], function(err, result) {
if (err) {
error = err;
return;
}
user = result.rows[0][0];
error = null;
connection.close(function(err) {
if (err) {
console.log(err);
}
});
})
}
);


/*
http.createServer(function(request, response) {
response.writeHead(200, {
'Content-Type': 'text/plain'
});
if (error === null) {
response.end('Connection test succeeded. You connected to ATP as ' + user + '!');
} else if (error instanceof Error) {
response.write('Connection test failed. Check the settings and redeploy app!\n');
response.end(error.message);
} else {
response.end('Connection test pending. Refresh after a few seconds...');
}
}).listen(3050);
*/

app.listen(3050, () => {
        console.log("Server running on port 3050");
    });

app.get('/', function (req, res) {
  	res.render("empty page");
})

app.get("/test", (req, res, next) => {
	console.log("test method working");
	res.send(["Margherita","Veggie","Cheese","Pepperoni"]);
    });

app.get("/riskandclaims", (req, res, next) => {
        console.log("going to get risk factors")
        oracledb.getConnection({
                user: dbConfig.dbuser,
                password: dbConfig.dbpassword,
                connectString: dbConfig.connectString
        },
	function(err, connection) {
        if (err) {
            error = err;
            return;
        }
	connection.execute("select * from claims c inner join riskfactors r on c.id2 = r.id where rownum <=15", [], function(err, result) {
            if (err) {
                error = err;
                return;
            }
	/*
            console.log("connection succeeded!! Gathering data");
            //user = result.rows[0][0];
            res.json(result.rows);
            console.log("done!");
            error = null;
	*/
	let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });
      res.send(resultArray);
            connection.close(function(err) {
            if (err) {
                    console.log(err);
                }
            });
        })
    }
);
});


app.get("/claims", (req, res, next) => {
        console.log("going for crmdata")
        oracledb.getConnection({
                user: dbConfig.dbuser,
                password: dbConfig.dbpassword,
                connectString: dbConfig.connectString
        },
	function(err, connection) {
        if (err) {
            error = err;
            return;
        }
	connection.execute("SELECT * FROM claims WHERE ROWNUM <= 15", [], function(err, result) {
            if (err) {
                error = err;
                return;
            }
	/*
            console.log("connection succeeded!! Gathering data");
            //user = result.rows[0][0];
            res.json(result.rows);
            console.log("claims data done!");
            error = null;
	*/
	let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });
      res.send(resultArray);
            connection.close(function(err) {
            if (err) {
                    console.log(err);
                }
            });
        })
    }
);
});

app.get("/riskfactors", (req, res, next) => {
        console.log("going for crmdata")
        oracledb.getConnection({
                user: dbConfig.dbuser,
                password: dbConfig.dbpassword,
                connectString: dbConfig.connectString
        },
	function(err, connection) {
        if (err) {
            error = err;
            return;
        }
	connection.execute("SELECT * FROM riskfactors WHERE ROWNUM <= 20", [], function(err, result) {
            if (err) {
                error = err;
                return;
            }
	/*
            console.log("connection succeeded!! Gathering data");
            //user = result.rows[0][0];
            res.json(result.rows);
            console.log("riskfactors data done!");
            error = null;
	*/
	let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });
      res.send(resultArray);
            connection.close(function(err) {
            if (err) {
                    console.log(err);
                }
            });
        })
    }
);
});

app.get("/riskandclaims/:claimid", (req, res, next) => {
        console.log("going to get risk factors")
	console.log(req.params.claimid)
	let newsql = "select * from claims c inner join riskfactors r on c.id2 = r.id where rownum <=15 and c.claim_number='"+ req.params.claimid + "' "
	
        oracledb.getConnection({
                user: dbConfig.dbuser,
                password: dbConfig.dbpassword,
                connectString: dbConfig.connectString
        },
	function(err, connection) {
        if (err) {
            error = err;
            return;
        }
	connection.execute(`${newsql}`, [], function(err, result) {
            if (err) {
                error = err;
                return;
            }
	/*
            console.log("connection succeeded!! Gathering data");
            //user = result.rows[0][0];
            res.json(result.rows);
            console.log("done!");
            error = null;
        */
	let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
	return rowObj;
      });
      res.send(resultArray);
            connection.close(function(err) {
            if (err) {
                    console.log(err);
                }
            });
        })
    }
);
});
