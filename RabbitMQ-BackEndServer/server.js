//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')
  , http = require('http')

var express = require('express')
var mongo = require('./services/mongo')
var cnn = amqp.createConnection({host:'127.0.0.1'});

var app = express();

//all environments
app.set('port', process.env.PORT || 3001);

var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message:I am from server "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			console.log("Hello Signup from server.js "+message.oper);
			
			if(message.oper=="signup"){
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});}
			else{
				console.log("handlerequest1");
			login.handle_request1(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});	}		
		});
	});
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});  