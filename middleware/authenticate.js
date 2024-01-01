const HttpError = require('../models/httpError');
const Creator = require('../models/creator')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }

    if (req.context.requestorType !== Creator.USER) {
        const error = new HttpError('Authentication fails', 401);
        return next(error);
    }
    return next();
}