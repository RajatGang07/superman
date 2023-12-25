var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');
const { format } = require("date-fns");
const cron = require('node-cron');

// 1st party dependencies
var configData = require("./config/connection");
var indexRouter = require("./routes/openRoutes");
const config = require('./config');
const defaultMiddleware = require('./middleware/default');
const authentication = require('./middleware/authenticate');
const usersRoutes = require('./routes/userRoutes');
const openRoutes = require('./routes/openRoutes');
const HttpError = require('./models/httpError');
const faceBookAppAuthenticationRoutes = require('./routes/faceBookAppAuthenticationRoutes');
const saveFaceebookCredentialsRoute = require('./routes/saveFaceebookCredentialsControllerRoutes');
const facebookAdsRoute = require('./routes/facebookAds')
const facebookGenerateCSV = require('./routes/facebookGenerateCSV');
const facebookData = require('./routes/facebookData');
const facebookConfig = require("./routes/facebookConfig");
const facebookGenerateCSVUsingConfig = require("./routes/facebookGenerateCSVUsingConfig");
const facebookGenerateCSVUsingConfigController = require('./controllers/facebook/facebookGenerateCSVUsingConfig');
const monitorPipeline = require("./routes/monitorPipeline");

async function getApp() {

  // Database
  var connectionInfo = await configData.getConnectionInfo();
  console.log('connectionInfo', connectionInfo)
  mongoose.connect(connectionInfo.DATABASE_URL);

  var app = express();

  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  // view engine setup
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.locals.format = format;

  app.use(defaultMiddleware);
  // NoAuth Required, i.e. login, redirect, sign up
  app.use('/', openRoutes);
  
  // Auth from this point forward
  // app.use(authentication)
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/facebook/auth', faceBookAppAuthenticationRoutes)
  app.use('/api/integrations/facebook_ads/ad_accounts', facebookAdsRoute)
  app.use('/api/save/fb', saveFaceebookCredentialsRoute)
  app.use('/api/v1/generate/csv', facebookGenerateCSV)
  app.use('/api/v1/ad/insights', facebookData)
  app.use('/api/v1/facebook/config', facebookConfig)
  app.use('/api/v1/get/facebook', facebookConfig)
  app.use('/api/v1/generate/csv/config', facebookGenerateCSVUsingConfig)
  app.use('/api/v1/get/log', monitorPipeline)


  // cron.schedule('* * * * *', () => {
  //   console.log('Cron job running every minute');
  //   // app.use('/api/v1/generate/csv/config', facebookGenerateCSVUsingConfig);
  //   facebookGenerateCSVUsingConfigController.fetchFacebookDataForAdvertsement();

  // });

  // app.use('/api/v1/add/categories', categoryRoutes);
  app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
  app.use(
    "/css",
    express.static(__dirname + "/node_modules/bootstrap/dist/css")
  ); // redirect CSS bootstrap

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  // app.use(function (err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get("env") === "development" ? err : {};

  //   console.log('I am here')
  //   // render the error page
  //   // res.status(err.status || 500);
  //   // res.render("error");
  // });

  return app;
}
/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
module.exports = {
  getApp
};