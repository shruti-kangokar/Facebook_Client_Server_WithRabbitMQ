var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/lab2_fb_db";
var bcrypt = require('bcrypt');


function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	console.log()
	res.code = "200";
	res.value = "Succes Login";
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);

		var coll = mongo.collection('facebook');
		coll.insertOne(
				{
					"fname" : msg.firstname,
					"lname" : msg.lastname,
					"email" : msg.username,
					"password" : msg.password,
					"dob" : msg.dob,
					"gender" : msg.gender,	
					"friends" : [],
					"groups" : [],
					"notifs" : []
				},function(err, result){
					if (result) {
						console.log("entered insert");
						callback(null, res);

					} else {
						console.log("returned false");
					}
		});
	});
}


// YOu cant query based on query as the password is salted and hashed
function handle_request1(msg, callback){
	var res = {};
	console.log("In handle request:"+ msg.username);
	console.log();
	res.code = "200";
	res.value = "Succes Login";
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('facebook');
		console.log("Find name: " + msg.username + " password " + msg.password);

		coll.findOne({email: msg.username}, {password: 1}, function(err,user) {
			if (user) {
				if (bcrypt.compareSync(msg.password, user.password)) {
					console.log("Found");
					console.log("Just before callback: " + JSON.stringify(res));
					callback(null,res);
				} else {
					console.log("Found false");
					res.code = "200";
					res.value = "Failed Login";
					console.log("Just before callback: " + JSON.stringify(res));
					callback(null,res);
				}
			}
		});
	});
}


exports.handle_request = handle_request;
exports.handle_request1 = handle_request1;
