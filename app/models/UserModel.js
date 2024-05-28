"use strict";
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate")
const bcrypt = require("bcryptjs")
require("dotenv").config()



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    isEmail: true,
    required: [true, "Please provide your email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (v) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v),
      message: () => 'Password must contain at least 8 characters, including one symbol, alphanumeric characters (uppercase and lowercase), and at least one number.',
    },
  },

}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      delete ret._id;
    }
  },
  timestamps: true,
  strict: false,

});

userSchema.pre('save', async function () {
  console.log(this.model('User'));
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", userSchema);
