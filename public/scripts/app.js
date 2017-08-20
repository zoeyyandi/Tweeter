/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(function() {

  const wordLimit = '140'

  function convertTime(time) {

    var today = new Date()
    // var time = today.getTime();
    var current = today.getTime()
    var daysAgo = Math.floor((current - time)/1000/60/60/24)
    return daysAgo
  }

  function createTweetElement(tweet) {
    const time = convertTime(tweet.created_at)
    return `<article class="tweet">
          <header class="tweet-header">
            <div id="leftHeader">
              <div class ="avatar"><img id="avatar" src=${tweet.user.avatars.small}></div>
              <h2>${tweet.user.name}</h2>
            </div>
            <p>${tweet.user.handle}</p>
          </header>
          <p class="tweet-title">${tweet.content.text} </p>
          <footer class="tweet-footer">
            <div class="left">
              <p>${time} days ago</p>
            </div>
            <div class="right">
              <ul class="icons">
                <li><i class="fa fa-flag" aria-hidden="true"></i></li>
                <li><i class="fa fa-retweet" aria-hidden="true"></i></li>
                <li><i class="fa fa-heart" aria-hidden="true"></i></li>
              </ul>
            </div>
          </footer>
        </article>`
  }

  function renderTweets(tweets, cb) {
    tweets.forEach(function(tweet) {

      var $tweet = cb(tweet)
      $('#tweets').prepend($tweet)
    })
  }

  // renderTweets(tweets, createTweetElement)

  // prevent default form submission, make ajax call instead
  $('#form').on('submit', function(event) {
    var data = $(this).serialize()
    event.preventDefault()
    var tweetContent = $('#text').val()
    if(tweetContent.length === 0) {
      $('#message').text('Tweet content should not be empty!')
      return
    }
    if(tweetContent.length > 140) {
      $('#message').text('Tweet content exceeds word limit!')
      return
    }
    $('#message').empty()
    $('.counter').html(wordLimit)
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: $(this).serialize(),
      success: function() {
        loadNewTweet()
      }
    })
    $('#text').val('')

  })

  function loadNewTweet() {
    $.ajax({
      url:'/tweets',
      method: 'GET',
      success: function(data) {
        console.log(data)
        var reversedData = data.reverse()
        var newTweet = reversedData.slice(0, 1)
        renderTweets(newTweet, createTweetElement)
      }
    })
  }

  function loadTweetsInitial() {
    $.ajax({
      url:'/tweets',
      method: 'GET',
      success: function(data) {
        renderTweets(data, createTweetElement)
      }
    })

  }

  loadTweetsInitial()

  $('.button1').on('click', function() {
    $('.new-tweet').slideToggle(function() {
      $('#text').focus()
    })
  })



})




