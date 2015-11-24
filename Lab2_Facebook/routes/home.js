var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/lab2_fb_db";

function getFriends(req,res)
{
    if(req.session.email)
    {
		console.log("Displaying the list of Friends");
		
		var email = req.session.email;
		
	    mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			
			var data = coll.find({email: email}, {friends:1, _id:0});
			data.each(function(err, doc)
			 {
				if (doc != null)
				{
					console.log(doc);
				}
			});				
		});
	}
	else
	{
		console.log("Going to login screen");
		res.redirect('/');
	}
};


function getMyFriends(req,res)
{
     if(req.session.email)
    {
		console.log("Displaying the list of Friends");
		
		var email = req.session.email;
		
	    mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			
			var data = coll.find({email: email}, {friends:1, _id:0});
			//console.log("*** " + data.toArray().length);

			/*
			data.each(function(err, doc)
			 {
				if (doc != null)
				{
					console.log("Doc is --> " + JSON.stringify(doc));
					console.log("Doc is --> " + doc.friends[0].fname + " " +doc.friends[0].lname);
					//console.log("Length -->" + doc.length);			
					
				}
			});
			*/

			data.toArray(function(e, results)
			{
				if (e) return next(e)
				res.send(results)
			});
			//console.log(JSON.stringify(data); //circular problem.
			//var doc = data.toArray();
			//console.log("Doc is --> " + doc.length);
			
			//res.json(doc);
		});
	}
	else
	{
		console.log("Going to login screen");
		res.redirect('/');
	}

};

function searchPeople(req,res)
{
    var pattern = req.param("searchStr");
    if(req.session.email)
    {
    console.log("Displaying the list of Friends");
		
		var email = req.session.email;
		
	    mongo.connect(mongoURL, function(){
			console.log('Searching for people in mongo: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			var data = coll.find(
			  { $or: [ { "fname": pattern }, {"lname": pattern} ] }
			  );

			data.toArray(function(e, results)
			{
				if (e) return next(e)
				res.send(results)
			});
		})
};
}


function searchFriendsTable(req,res){
    if(req.session.email)
    {
   	 	var friendFName = req.param("id1");
   	 	var friendLName = req.param("id2");
   	 	console.log("FName: " + friendFName + " LName: " + friendLName);
    	var uid = req.session.email;
    	
    	// Mongo code
    	mongo.connect(mongoURL, function(){
    		console.log('Connected to mongo at: ' + mongoURL);
    		var coll = mongo.collection('facebook');
    		console.log("Is this: " + friendFName + " " + friendLName + " my friend " + uid);

    		
    		coll.findOne({email: uid}, function(err,user) {
    			
    			var myFriends = user.friends;
    			var status = 401;
    			for (i = 0; i < myFriends.length; i++) {
    				if (myFriends[i].fname === friendFName && myFriends[i].lname === friendLName) {
    					status = 200;
    					break;
    				}
    			}
    			var json_response = {"status" : status};
				res.json(json_response);
    		});
    	});
    }
    else
    {
		console.log("Going to login screen");
		res.redirect('/');
    }

};

function newGetFriends(req, res) {
    //res.send("Ok");
    var friendPattern = req.param("searchStr");
    console.log("Querying DB for " + friendPattern);

    if(req.session.email)
    {
	//  SQL Query for extracting all the data from db from the user
	var vgetFriends="select fname,lname from login where fname ='" + friendPattern + "' OR lname ='" + friendPattern + "'";
	console.log(" Query for finding the friends is:"+getFriends);
	
	//function(err, results)--> Call back function
	mysql.fetchData(function(err,results){
	    if(err)
	    {
		throw err;
	    }
	    else 
	    {
		if(results.length > 0) {
                    console.log("Yes more than 0 found");
		    json_responses = [{"statusCode" : 200}, {"searchPattern" : friendPattern}];
                    //console.log("Print data obtained");
                    //console.log(JSON.stringify(results));
                    //results.push(json_responses);
                    //results.forEach(function(item) {
                    //    console.log(JSON.stringify(item));
                    //});
		    //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    //res.render("searchFriendsList",{data: results});
                    res.send(json_responses);
		    
		} else {
                    console.log("Found none matching");
                    res.render("errPage", {str: "Did not find any friends matching that pattern"});
                }
	    }
	},vgetFriends);
    }
    else
    {
	console.log("Going to login screen");
        json_responses = {"statusCode" : 401};
        res.send(json_responses);
	//res.redirect('/');
    }
}

function showSearchResults(req, res) {


    //res.send("<html><head></head><body><h1>Hello " + req.params.str + "</h1></body></html>");

    var strSearch = req.params.str;
    console.log(">>>>>> " + strSearch);
    if(req.session.email)
    {
	console.log("Displaying the list of Friends");
	
	var uid = req.session.email;
	
	//  SQL Query for extracting all the data from db from the user
	var vgetFriends="select fname,lname from login where fname ='" + strSearch + "' OR lname ='" + strSearch + "'";
	console.log(" Query for finding the friends is:"+getFriends);
	
	//function(err, results)--> Call back function
	mysql.fetchData(function(err,results){
	    if(err)
	    {
		throw err;
	    }
	    else 
	    {
		if(results.length > 0){
		    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		    res.render("searchFriendResult",{data: results});
		    
		}
	    }
	},vgetFriends);
	
    }
    else
    {
	console.log("Going to login screen");
	res.redirect('/');
    }
}


function logout(req,res)
{
	req.session.destroy();
	res.redirect('/');
}



function about(req,res) {
    if(req.session.email) {
		var uid = req.session.email;
		console.log("About page for User with ID: " + uid);
		
		// Query DB to get all data about him
		// Name
		// Age
		// Gender
		// DOB
		// Email
		var getData = "select fname,lname,email,birthday,gender from login where userId ='" +uid+"'";
		mysql.fetchData(function(err,results){
	    if(err) {
			throw err;
	    } else {
			if(results.length === 1) {
                console.log("Yes more than 0 found");
	    		//json_responses = [{"statusCode" : 200}, {"searchPattern" : friendPattern}];
				//res.send(json_responses);
				console.log(results);
				res.render("about",{data:results});
				
			} else {
				console.log("Found none matching");
				res.render("errPage", {str: "Did not find any friends matching that pattern"});
			}
	    }
		},getData);
		
		
	}
}

function showGroups(req,res) {
    if(req.session.email) {
		var email = req.session.email;

	    mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			
			var data = coll.find({email: email}, {groups:1, _id:0});
			data.toArray(function(e, results)
			{
				if (e) return next(e)
				res.send(results)
			});
		});
	}
}

function addGroup(req,res) {
 if(req.session.email) {
		var email = req.session.email;
		var groupName = req.param("grName");
		console.log("Adding the group: " + groupName);
	    mongo.connect(mongoURL, function(){
			console.log('Adding group to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			var data = coll.update({email: email}, {$addToSet : {groups: { $each: [groupName]}}});
		});
	}
	else {
		console.log("Going to login screen");
		res.redirect('/');
	}
}

function addToGroup(req,res) {
    if(req.session.email) {
   var uid = req.session.email;
    	var gid = req.param("grId");
    	console.log("Adding: " + uid +" to the group " +gid);
		var addMember = "insert into groupMemberTable values ('"+gid+"', '"+uid+"')";
		
		mysql.addData(function(err,results){
		    if(err) {
				throw err;
		    } else {
		    	console.log(JSON.stringify(results));
				res.json(results);
		    }
		},addMember);
	} else {
		console.log("Going to login screen");
		res.redirect('/');
	}
}


function groupInfo(req,res) {
	if(req.session.email) {
		var grpName = req.params.str;
		var getMemInGrp="SELECT l.fname,l.lname FROM Login l INNER JOIN person_group pg ON l.email = pg.person_id INNER JOIN Groups g ON g.groupid = pg.group_id WHERE g.groupName ='"+grpName+"'";
		console.log(" Query for finding the members in a Group " + grpName + " is:"+getMemInGrp);
	
		//function(err, results)--> Call back function
		mysql.fetchData(function(err,results){
			if(err) {
				throw err;
	    	}
	    	else 
	    	{
				if(results.length > 0){
		    	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		    	res.render("groupsInfo",{data: results});		    
				}
	    	}
		},getMemInGrp);
	} else {
		console.log("Going to login screen");
		res.redirect('/');
	}
}



function getNotifications(req,res){
	
	if(req.session.email) {
	
		var email = req.session.email;
		
		// Mongo Query
	    mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			
			var data = coll.find({email: email}, {notifs:1, _id:0});
			data.toArray(function(e, results)
			{
				if (e) {
					return next(e)
				}
				res.send(results)
			});
		});

	} else {
		console.log("Going to login screen");
		res.redirect('/');
	}
}

function getMyGroups(req,res)
{
    if(req.session.email) {
		var email = req.session.email;

	    mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);			
			var coll = mongo.collection('facebook');
			
			var data = coll.find({email: email}, {groups:1, _id:0});
			data.toArray(function(e, results)
			{
				if (e) {
					return next(e)
				}
				res.send(results)
			});
		});
	}
    else
    {
		console.log("Going to login screen");
		res.redirect('/');
    }
};

function getGroupMembers(req,res){
	if(req.session.email) {
		var grpId = req.params.id;
		console.log("Grp id: "+ grpId);
		var getMembers= "select * from groupMemberTable gm inner join loginTable lg On gm.pid = lg.email where gm.gid = '"+grpId+"'";
		console.log("Query for getting members in the group " +getMembers);
		//function(err, results)--> Call back function
		mysql.fetchData(function(err,members){
			if(err)
			{
				throw err;
			}
			else 
			{
				console.log(JSON.stringify(members));
				res.json(members);
			}
		},getMembers);
	} else {
		console.log("Going to login screen");
		res.redirect('/');
	}
}


exports.addGroup = addGroup;
exports.addToGroup= addToGroup;
exports.about=about;
exports.showGroups=showGroups;
exports.groupInfo=groupInfo;
exports.getFriends = getFriends;
exports.newGetFriends = newGetFriends;
exports.showSearchResults = showSearchResults;
exports.logout = logout;
exports.getMyFriends = getMyFriends;
exports.getMyGroups = getMyGroups;
exports.searchPeople = searchPeople;
exports.searchFriendsTable = searchFriendsTable;
exports.getNotifications = getNotifications;
exports.getGroupMembers = getGroupMembers;
