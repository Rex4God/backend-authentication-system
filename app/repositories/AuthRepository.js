"use strict";
const Repository = require("./MongoDBRepository")
const UserModel = require("../models/UserModel")


class UserRepository extends Repository{
    constructor(){
     super(UserModel)
    }
}

module.exports =(new UserRepository())