class RequestContext {
    constructor(requestorId, requestorType, additionalDetails) {
        this.requestorId = requestorId;
        this.requestorType = requestorType;
        this.additionalDetails = additionalDetails;
    }
}

module.exports = RequestContext;