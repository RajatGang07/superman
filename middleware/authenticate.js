const HttpError = require('../models/httpError');
const jwt = require('jsonwebtoken');
const config = require('../config');
const RequestContext = require('../models/requestContext')
const Creator = require('../models/creator')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    
    console.log('I am here')
    if (req.context.requestorType !== Creator.USER) {
        const error = new HttpError('Authentication fails', 401);
        return next(error);
    }
    return next();
}