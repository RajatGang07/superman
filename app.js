const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const defaultMiddleware = require('./middleware/default');
const authentication = require('./middleware/authenticate');
const usersRoutes = require('./routes/userRoutes');
const openRoutes = require('./routes/openRoutes');
const HttpError = require('./models/httpError');
const faceBookAppAuthenticationRoutes = require('./routes/faceBookAppAuthenticationRoutes')

const app = express();
app.use(bodyParser.json());

app.use(defaultMiddleware);
// NoAuth Required, i.e. login, redirect, sign up
app.use('/', openRoutes);

// Auth from this point forward
// app.use(authentication)
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/facebook/auth', faceBookAppAuthenticationRoutes)
// app.use('/api/v1/add/categories', categoryRoutes);

// No such path, 404
app.all('*', (req, res, next) => {
    throw new HttpError(`Can't find ${req.originalUrl} on this server!`, 404)
});


app.use(function (err, req, res, next) {

    let httpCode = 500;
    let json = {
        status: "fail",
        message: "Something broke!",
        details: {}
    }

    if (err instanceof HttpError) {
        httpCode = err.code;
        json.message = err.message;
        json.details = err.details;
    } else {
        console.log("Unhandled Error ", err);
    }
    res.status(httpCode).json(json)
})

mongoose.connect(`mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}/littlelittle?retryWrites=true&w=majority`).then(() => {
    app.listen(config.appPort);
}).catch(err => console.log(err));