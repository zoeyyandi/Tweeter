"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const md5           = require('md5');
const generateRandomString = require('../lib/util/randomString.js')

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const userHandle = req.session.user_id.userID

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    const user = {
      name: `${req.session.user_id.firstName} ${req.session.user_id.lastName}`,
      avatars,
      handle: userHandle
    }

    const tweet = {
      id: generateRandomString(12),
      user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: []
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.post("/likes", function(req, res) {
    const tweetID = req.body.id 
    const userID = req.session.user_id.userID
    console.log('twId', tweetID, 'user', userID)
    DataHelpers.addLike(tweetID, userID, (err, result) => {
      if(err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log('hihihihii')
        res.status(200).send();
      }
    })
  })

  return tweetsRoutes;

}
