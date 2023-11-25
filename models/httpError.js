class HttpError extends Error {

    constructor(message, errorCode, details) {
        super(message); // Add a message property
        this.code = errorCode;
        this.details = details;
    }
    
}

module.exports = HttpError;