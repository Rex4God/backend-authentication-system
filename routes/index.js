"use strict";
const home = require("./home")
module.exports = (app) => {
    app.use("/", home)
    app.use("/v1/auths/", require("./auth"))
    
};
