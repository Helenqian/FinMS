var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var secret = require('./config/secret');
var User = require('./models/user');
var Customer = require('./models/customer');
var Account = require('./models/Account');
var Header = require('./models/Header');
var AccountDocument = require('./models/AccountDocument');
var DocumentItem = require('./models/DocumentItem');
var Initial = require('./models/Initial');
var BlnSheet = require('./models/BlnSheet');
var PlSheet = require('./models/PlSheet');


var exp = express();
//var apps = require('./assets/js/src/app');

mongoose.connect(secret.database, function(err){
	if (err){
		console.log(err);
	} else {
		console.log("Connected to the database");
	}
});

// Middleware
exp.use(express.static(__dirname + '/public'));
exp.use(morgan('dev'));
exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: true})); // express explication could parse the data format
exp.use(cookieParser());
exp.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
exp.use(flash());
exp.use(passport.initialize());
exp.use(passport.session());
exp.use(function(req, res, next){
	res.locals.user = req.user;
	next();
}); // 使所有页面的user为同一个

/*exp.use(function(req, res, next){
	Header.find({}, function(err, headers){
		if(err) return next(err);
		res.locals.headers = headers;
		next();
	});
});*/

exp.engine('ejs', engine);
exp.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var customerRoutes = require('./routes/customer');
var adminRoutes = require('./routes/admin');
var documentRoutes = require('./routes/document');
var accountRoutes = require('./routes/account');
var accdocRoutes = require('./routes/accdoc');
var manageuserRoutes = require('./routes/manageuser');
var initialRoutes = require('./routes/initialize');
var settleRoutes = require('./routes/settle');
var sheetRoutes = require('./routes/sheet');
var docitemRoutes = require('./routes/docitem');
exp.use(mainRoutes);
exp.use(userRoutes);
exp.use(customerRoutes);
exp.use(adminRoutes);
exp.use(documentRoutes);
exp.use(accountRoutes);
exp.use(accdocRoutes);
exp.use(docitemRoutes);
exp.use(manageuserRoutes);
exp.use(initialRoutes);
exp.use(settleRoutes);
exp.use(sheetRoutes);

exp.listen(secret.port, function(err) {
	if (err) throw err;
	console.log("Server is Running on port " + secret.port);
});