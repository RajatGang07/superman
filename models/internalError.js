class InternalError extends Error {

    constructor(message, internalCode, details) {
        super(message); 
        this.internalCode = internalCode;
        this.details = details;
    }
    
}

module.exports = InternalError;