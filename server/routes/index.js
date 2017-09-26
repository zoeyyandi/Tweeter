"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const indexRoutes  = express.Router();
const generateRandomString = require('../lib/util/randomString.js')

module.exports = function(DataHelpers) {

  indexRoutes.get("/", function(req, res) {
    if (req.session.user_id) {
      res.send({isLoggedIn: true})
    } else {
      res.send({isLoggedIn: false})
    } 
  });

  indexRoutes.post("/register", function(req, res) {
    DataHelpers.getUserByEmail(req.body.Email, (err, result) => {
      if(err) {
        res.send({message: 'Unexpected error occurred!'})
      } else if(result !== undefined) {
        res.send({message: 'Email already registered!'})  
      } else {
        let randomString = generateRandomString(4)
        let firstName = req.body.fName
        let lastName = req.body.lName
        let userID = `${firstName}${randomString}`
        let email = req.body.Email
        let password = req.body.Password
        let newUser = {
          firstName,
          lastName,
          userID,
          email,
          password
        }
        req.session.user_id = newUser
        DataHelpers.saveUser(newUser, function(err) {
          if (err) {
            res.send({message: 'Unexpected error occurred!'})
          } else {
            res.send({message: 'Registration successful!'})
          }
        })
      }
    })
  })
  indexRoutes.post("/login", function(req, res) {
    DataHelpers.getUserid(req.body.Email, req.body.Password, (err, result) => {
      if(err) {
        res.send({message: 'Unexpected error occurred!'})
      } else if (result === undefined) {
        res.send({message: 'User not registered!'})
      } else {
        req.session.user_id = result 
        res.send({message: 'Login successful!'})
      }
    })
  });


  indexRoutes.post("/logout", function(req, res) {
    req.session = null
    res.send({message: 'Logout successful!'})
  })
  
  
  return indexRoutes;
}
