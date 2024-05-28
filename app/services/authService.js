"use strict";
const { StatusCodes } = require("http-status-codes")
const authRepository = require("../repositories/AuthRepository")
const authValidator = require("../validators/AuthValidator")
const { createJWT } = require("../utils/jwt")



exports.createUser = async (body, options) => {
  try {
    const validatorError = await authValidator.createUser(body);
    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      }
    }
    const { email } = body
    const alreadyExistsUser = await authRepository.findOne({ email }).catch(
      (err) => {
        console.log("Error: ", err);
      });

    if (alreadyExistsUser) {
      return {
        error: "User Already exist in the database",
        statusCode: StatusCodes.CONFLICT
      };
    };
    const user = await authRepository.create({
      email: body.email,
      password: body.password,
    });

    const token = await createJWT({ payload: { user }, options })

    return {
      data: {
        user: {
          email: user.email,
          userId: user._id,
        },
        token
      },
      statusCode: StatusCodes.CREATED
    }
  } catch (e) {
    console.log("An unknown error has occurred while trying to create a user. Please try again later" + e);
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};

exports.login = async (body, options) => {
  try {
    const validatorError = await authValidator.login(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      }
    }

    const { email, password } = body
    if (!email || !password) return {
      error: "Please provide your email and password",
      statusCode: StatusCodes.BAD_REQUEST
    }
    const user = await authRepository.findOne({ email })
    if (!user) return {
      error: "Invalid Credential",
      statusCode: StatusCodes.BAD_REQUEST
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return {
      error: "Invalid Credential",
      statusCode: StatusCodes.BAD_REQUEST
    }
    const token = await createJWT({ payload: { user }, options })
    return {
      data: {
        user: {
          email: user.email,
          userId: user._id,
        },
        token
      },
      statusCode: StatusCodes.OK,
    }
  } catch (e) {
    console.log("An unknown error has occurred. Please try again later" + e);
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
  }
};