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
        callback(null, result[0].tweets.sort(sortNewestFirst))
      })
    }
  };
}
