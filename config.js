var config = {
    mongo: {
        host: process.env.MONGO_HOST || "cluster0.kcsnfft.mongodb.net",
        port: process.env.MONGO_PORT || 80,
        user: process.env.MONGO_USER || "gangrajatmail",
        password: process.env.MONGO_PASSWORD || "littlelittle07",
    },
    appPort: process.env.APP_PORT || 5003,
    appHost: process.env.APP_HOST || "http://localhost:5003",
    uri_Redirect: 'https://beigebananas.com/blog/',
    app_id: '2584462238376302',
    app_secret: '8a05ff0e33ce2af0c676659a0d3cd27a',
    jwt: {
        secret: process.env.JWT_SECRET || "supersecret_dont_share"
    },
    redirections: {
        expiryThresholdSeconds: 30
    }
};


module.exports = config;