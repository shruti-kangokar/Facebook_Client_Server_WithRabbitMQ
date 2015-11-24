/**
 * Module facebook dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , login = require('./routes/login')
  , home = require('./routes/home')
  , path = require('path');
    
var app = express();

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

// all environments
//configure the sessions with our application
app.use(expressSession({
	secret: 'cmpe273_FaceBookLab2',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.use("/views", express.static(path.join(__dirname, 'views')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//In get all the data is in the header (Packet : header  and body )
app.get('/', routes.index);
app.get('/users', user.list);


app.post('/checklogin',login.checklogin);
app.get('/homepage', login.redirectToHomepage);
app.get('/newfriends', home.newGetFriends);
app.post('/logout',login.logout);
app.get('/api/getMyFriends',home.getMyFriends);
app.get('/api/searchPeople',home.searchPeople);
app.get( '/api/searchFriendsTable', home.searchFriendsTable);
app.get('/api/getNotifications',home.getNotifications);
app.get('/api/getMyGroups',home.getMyGroups);
app.post('/api/addGroup',home.addGroup);
app.post('/api/addToGroup',home.addToGroup);
app.post('/api/getGroupMembers/:id', home.getGroupMembers);

app.get("/showSearchResults/:str", home.showSearchResults);
app.get('/loginpage',home.logout);
app.post('/addUser',login.addUser);
app.get('/about', home.about);
app.get('/showGroups',home.showGroups);
//app.post('/createGroup',home.addGroup);
app.get("/groups/:str", home.groupInfo);
//app.get("/api/getMyFriends", home.getFriendsRMQ);

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/
//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});

/*
Syntax of data returned from SQL querystring
[{"pid2":2},{"pid2":3}]
*/