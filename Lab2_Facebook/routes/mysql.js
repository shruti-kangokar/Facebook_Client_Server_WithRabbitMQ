var ejs= require('ejs');
var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 100,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'lab2_fb_db',
    port	 : 3306
});


function fetchData(callback,sqlQuery){
    
    //console.log("\nSQL Query::"+sqlQuery);
        
    connection.getConnection(function(err, cnxn) {
        if (err) {
            cnxn.release();
            return {};
        }

        //console.log("Connected with ID: " + cnxn.threadId);

        cnxn.query(sqlQuery, function(err, rows, fields) {
            console.log("\nReleasing connection.");
            cnxn.release();
	    if(err){
	        console.log("ERROR --> " + err.message);
	    }
	    else 
	    {	// return err or result
	        callback(err, rows);
	    }
        });

        cnxn.on("error", function(err) {
            console.log("ERROR2 --> " + err.message);
        });
    });
	
}

function addData(callback,sqlQuery){
    
    connection.getConnection(function(err, cnxn) {
        if (err) {
            cnxn.release();
            return {};
        }

        //console.log("Connected with ID: " + cnxn.threadId);

        cnxn.query(sqlQuery, function(err, rows, fields) {
            console.log("\nReleasing connection.");
            cnxn.release();
	    if(err){
	        console.log("ERROR: " + err.message);
	    }
	    else 
	    {	// return err or result
	        //console.log("Result of adding to DB:"+JSON.stringify(rows));
	        callback(err, rows);
	    }
        });

        cnxn.on("error", function(err) {
            console.log(err.message);
        });
    });
	
}


exports.fetchData=fetchData;
exports.addData = addData;
