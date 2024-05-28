"use strict"
const response = require("../utils/responses");
const authService = require("../services/authService")


exports.createUser =async(req, res)=>{
    const{
        error,
        data,
        statusCode
      } = await authService.createUser(req.body);

      if(error) return response.error(res, error, statusCode);

      return response.success(res, data, statusCode)

};

exports.login =async(req, res)=>{
    const{
        error,
        data,
        statusCode
      } = await authService.login(req.body);

      if(error) return response.error(res, error, statusCode);

      return response.success(res, data, statusCode)

};

