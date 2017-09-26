"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
       db.collection("tweets").update({id: "tweets"}, {$push: {tweets: newTweet}}, (err, result) => {
        if(err) {
          return callback(err)
        }
        return callback(null, result)
       })
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
       db.collection("tweets").find().toArray((err, result) => {
        if (err) {
          return callback(err)
        }
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, result[1].tweets.sort(sortNewestFirst))
      })
    },

    getTweetById: function(id, callback) {
      db.collection("tweets").find().toArray((err, result) => {
        if(err) {
          return callback(err)
        }
        const tweet = result[0].tweets.find(item => item.id === id)
        callback(null, tweet)
      })
    },

    // Get user by Email 
    getUserByEmail: function(email, callback) {
      db.collection("tweets").find().toArray((err, result) => {
        if (err) {
          return callback(err)
        }
        let users = result[0].users
        let isRegistered = users.find(function(item) {
          return item.email === email
        })
        callback(null, isRegistered)
      })
    },
    saveUser: function(user, callback) {
      db.collection("tweets").update({id: "users"}, {$push: {users: user}}, (err, result) => {
        if (err) {
          return callback(err)
        }
        return callback(null, result)
      })
    },
    getUserid: function(email, password, callback) {
      db.collection("tweets").find().toArray((err, result) => {
        if (err) {
          return callback(err)
        }
        let users = result[0].users
        let user = users.find(function(item) {
          return email === item.email && password === item.password
        })
        // let userID = user.userID
        callback(null, user)
      })
    },
    addLike: function(tweetID, userID, callback) {

      db.collection("tweets").update({id: "tweets", "tweets.id": tweetID}, {$push: {"tweets.$.likes": userID}}, (err, result) => {
        if(err) {
          return callback(err)
        }
        return callback(null, result)
      })  
    }
  };
}