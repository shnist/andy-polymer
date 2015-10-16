var koa = require('koa');
var route = require('koa-route');
var logger = require('koa-logger');
var cors = require('koa-cors');
var request = require('koa-request');

var redis = require('redis');
var coRedis = require('co-redis');


var database = redis.createClient('6379', '192.168.59.103');
var coDatabase = coRedis(database);
var app = koa();


// middleware
app.use(logger());
app.use(cors());


// route middleware
app.use(route.get('/', home));
app.use(route.get('/v1/tube-status', tubeStatus));


// route definitions 
function *home () {
	this.body = 'Hello world';
}

function *tubeStatus () {
	var options = {
		url: 'https://api.tfl.gov.uk/line/mode/tube/status'
	};

	var key = 'tube-status';

	var statusCache = yield coDatabase.get(key);

	if (statusCache !== null) {
		return this.body = statusCache;
	}

	var response = yield request(options);
	var tubeStatuses = JSON.parse(response.body);
	var info = [];

	tubeStatuses.forEach(function (tubeLine){
		var line = {};
		line.name = tubeLine.name;
		line.status = tubeLine.lineStatuses[0].statusSeverityDescription;

		info.push(line);
	});

	yield coDatabase.set(key, JSON.stringify(info));

	this.body = info;
}


app.listen(3000);
console.log('Listening on port 3000');