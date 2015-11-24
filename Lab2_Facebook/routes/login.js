	/**
	 * Routes file for loginTable
	 */

var mongo = require("./mongo");
var bcrypt = require('bcrypt');
var mongoURL = "mongodb://localhost:27017/lab2_fb_db";
var mq_client = require('../rpc/client');


var ejs = require("ejs");

exports.checklogin = function(req,res)
{

    var email, password, json_responses;
    email = req.param("username");
    password = req.param("password");
    
	var msg_payload = { "username": email, "password": password, "oper":"sigin" };

    console.log(email +" is trying to log in");
    
    mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				json_responses = {"statusCode" : 200};
				req.session.email = email;
				res.json(json_responses);
			}
			else {    
				
				console.log("Invalid Login");
				json_responses = {"statusCode" : 401};
				res.json(json_responses);
			}
		}  
	});
};

//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	console.log("In redirect");
	//Checks before redirecting whether the session is valid
	if(req.session.email)
	{
		console.log("Going to Homepage");
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{email:req.session.email});
	}
	else
	{
		res.redirect('/');
	}
};	
	
//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};


	//Logout the user - invalidate the session
exports.addUser = function(req,res)
	{
	var firstname, lastname,email,password, gender, month, date, year, dob;
    firstname = req.param("firstname");
    lastname = req.param("lastname");
    email = req.param("email");
    password = req.param("password");
    gender = req.param("gender");
    month = req.param("month");
    date = req.param("date");
    year = req.param("year");
    dob = month + "/" + date + "/" + year;
	console.log("In adduser nodejs");

	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password,salt);

	var msg_payload = { "username": email, "password": hash, "firstname": firstname, "lastname":lastname, "gender": gender,"dob": dob ,"oper":"signup" };
	console.log("In POST Request = UserName:"+ email+" password "+password);

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log(" This is the rsult fom mq_client "+results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				json_responses = {"statusCode" : 200};
				console.log("Inserted a document into the mongo. ");
				//console.log(result);
				res.json(json_responses);
			}
		}  
	});

	
	
	
	/*
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('facebook');
		coll.insertOne(
		{
			"fname" : firstname,
			"lname" : lastname,
			"email" : email,
			"password" : hash,
			"dob" : dob,
			"gender" : gender,	
			"friends" : [],
			"groups" : [],
			"notifs" : []
		}, function(err, result) {
			if (err) {
				throw err;
			}
			json_responses = {"statusCode" : 200};
			console.log("Inserted a document into the mongo. ");
			console.log(result);
			res.json(json_responses);
  		});
  	});
  	*/
}
	
	
	
	
	
	
	
	
	