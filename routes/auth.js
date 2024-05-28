"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/AuthController")


router.post("/register", controller.createUser);

router.post("/login",controller.login)




module.exports=router