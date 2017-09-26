/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(function() {

  const wordLimit = '140'

  //convert time to x many days ago//
  const convertTime = (time) => {

    const today = new Date()
    const current = today.getTime()
    const daysAgo = Math.floor((current - time)/1000/60/60/24)
    return daysAgo
  }
  //built -in function to prevent cross-site scripting//
  const escape = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  //create each tweet element in html//
  const createTweetElement = (tweet) => {
    const time = convertTime(tweet.created_at)
    return `<article class="tweet">
          <header class="tweet-header">
            <div id="leftHeader">
              <div class ="avatar"><img id="avatar" src=${tweet.user.avatars.small}></div>
              <h2>${tweet.user.name}</h2>
            </div>
            <p>${tweet.user.handle}</p>
          </header>
          <p class="tweet-title">${escape(tweet.content.text)} </p>
          <footer class="tweet-footer">
            <div class="left">
              <p>${time} days ago</p>
            </div>
            <div class="right">
              <ul class="icons">
                <li><i class="fa fa-flag" aria-hidden="true"></i></li>
                <li><i class="fa fa-retweet" aria-hidden="true"></i></li>
                <li><i data-id=${tweet.id} data-like= class="fa fa-heart" aria-hidden="true"></i></li>
                <li>${tweet.likes.length}</li>
              </ul>
            </div>
          </footer>
        </article>`
  }
  //For each tweet, we are creating a tweet element that we are adding to the container//
  const renderTweets = (tweets) => {
    tweets.forEach((tweet) => {
      const $tweet = createTweetElement(tweet)
      $('#tweetsOuterContainer').prepend($tweet)
    })
  }



  // prevent default form submission for each tweet, make ajax call instead//
  // check to see if length of tweet exceeds max length or is empty, if it is, prevent submission//
  $(document).on('submit', '#form', function(event) {
    const data = $(this).serialize()
    event.preventDefault()
    const tweetContent = $('#text').val()
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
        $('#text').val('')
      }
    })
  })

  //when the tweet is submitted, we will asynchronously load the tweet onto the page with most recent tweet on top//
  const loadNewTweet = () => {
    $.ajax({
      url:'/tweets',
      method: 'GET',
      success: function(data) {
        var reversedData = data.reverse()
        var newTweet = reversedData.slice(0, 1)
        renderTweets(newTweet)
      }
    })
  }
  //when the user initially logs in, load all the tweets//
  const loadTweetsInitial = () => {
    $.ajax({
      url:'/tweets',
      method: 'GET',
      success: function(data) {
        renderTweets(data)
      }
    })

  }

  //if user is logged in, 
  const loadLoginRegisterButtons = () => {
    $.ajax({
      url:'/index',
      method: 'GET',
      success: function(data) {
        if(data.isLoggedIn){
          renderDivs()
          createComposeForm()
          loadTweetsInitial()
          renderLogoutButton()
        } else {
          renderLoginRegisterButtons()
        }
      }
    })
  }

  //when user clicks the logout button//
  const logout = () => {
    $.ajax({
      url:'index/logout',
      method: 'POST',
      success: function(data) {
        if(data.message = "Logout successful!") {
          renderLoginRegisterButtons()
          $("#buttons").empty()
        }
      }
    })   
  }


  const createRegistrationForm = () => {
    return `<section class="register-form"> 
     <h2>Register</h2>
    <form id="registerForm">
        <label class="loginCredentials">First Name:</label> <br/>
        <input name='fName' type = 'text'/> <br/>
        <label class="loginCredentials">Last Name:</label> <br/>
        <input name='lName' type = 'text'/> <br/>
        <label class="loginCredentials">Email Address*:</label> <br/>
        <input name='Email' type = 'email'/> <br/>
        <label class="loginCredentials">Password*:</label> <br/>
        <input name='Password' type ='password'/> <br/>
        <input type="submit" value = 'Register'/>
   </form>   
  </section>`
  }

  const createComposeForm = () => {
    const compose = `<section id="composeForm" class="new-tweet noShow">
    <h2>Compose Tweet</h2>
    <form id="form">
      <textarea id="text" name="text" placeholder="What are you humming about?"></textarea>
      <input id="button" type="submit" value="Tweet">
      <p id="message"> </p>
      <span class="counter">140</span>
    </form>
  </section>
  <section id="tweets"> </section>`
    $('#createTweetBox').html(compose)
  }

  const createLoginForm = () => {
    return `<section class="login-form"> 
    <h2>Login</h2>
    <form id="loginForm">
        <label class="loginCredentials">Email Address*:</label> <br/>
        <input name='Email' type = 'Email'/> <br/>
        <label class="loginCredentials">Password*:</label> <br/>
        <input name='Password' type ='password'/> <br/>
        <input type="submit" value = 'Login'/>
    </form> 
  </section>`
  }

  //when like button is clicked//
  $(document).on('click', '.fa.fa-heart', function(event) {
    const numberElement = $(this).parent().next()
    
    if($(this).data('like')) {
      $(this).removeClass('liked')
      $(this).data('like', false)
      numberElement.text(Number(numberElement.text()) - 1)
    } else {
      $(this).addClass('liked')
      $(this).data('like', true)
      numberElement.text(Number(numberElement.text()) + 1)
    }
    
  const data = {
    id: $(this).data('id'),
    like: !$(this).data('like')
  }
   $.ajax({
     url: '/tweets/likes',
     method: 'POST',
     data
   })
  })

  //when logout button is clicked//
  $(document).on('click', '#Logout', function(event) {
    event.preventDefault()
    logout()
  })

  //when register button is clicked, we will render the registration form in the container 
  $(document).on('click', '#RegisterBtn', function(event) {
    event.preventDefault()
    let registrationForm = createRegistrationForm()
    $('.container').html(registrationForm)
  })

  $(document).on('click', '#loginBtn', function(event) {
    event.preventDefault()
    let loginForm = createLoginForm()
    $('.container').html(loginForm)
  })

  $(document).on('click', '#Compose', function(event) {
    event.preventDefault()
    $('#composeForm').slideToggle(function () {
      $('#text').focus()
    })
  })

  //when page loads and user is not logged in, we will render the login and register buttons by adding it to the container//
  const renderLoginRegisterButtons = () => {
    const buttons =  `<section class="LoginRegisterButtons">
    <div id="regBtnContainer"> <a id="RegisterBtn"> Register </a> </div>
    <div id="loginBtnContainer"> <a id="loginBtn"> Login </a> </div>
    </section>`   
    $('.container').html(buttons)
  }

  //when user logs in, we will render the logout button to the buttons ul in the nav-bar//
  const renderLogoutButton = () => {
    const logoutButton = `<li class="button1"><a id="Logout" href="#Logout"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</a></li>
    <li class="button1"><a id="Compose" href="#Compose"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Compose</a></li>`
    $('#buttons').html(logoutButton)
  }

  const renderDivs = () => {
    const divs = `<div id="createTweetBox"> </div>
    <div id="tweetsOuterContainer"></div>`
    $('.container').html(divs)
  }

  //when user submits register form, we are preventing default form submission//
  //doing ajax call, if registration is successful we are rendering all the tweets and the logout button//
  $(document).on('submit', '#registerForm', function(event) {
    const data = $(this).serialize()
    event.preventDefault()
    $.ajax({
      url:'index/register',
      method: 'POST',
      data: data,
      success: function(data) {
        if(data.message === 'Registration successful!') {
          renderDivs()
          createComposeForm()
          loadTweetsInitial()
          renderLogoutButton()
        } else {
          alert(data.message)
        }
      }
    })
  })
  //when user submits login form, we are preventing default form submission//
  //doing ajax call, if login is successful we are rentering all the tweets and the logout button//
  $(document).on('submit', '#loginForm', function(event) {
    const data = $(this).serialize()
    event.preventDefault()
    $.ajax({
      url:'index/login',
      method: 'POST',
      data: data,
      success: function(data) {
        if(data.message === 'Login successful!') {
          renderDivs()
          createComposeForm()
          loadTweetsInitial()
          renderLogoutButton()
        } else {
          alert(data.message)
        }
      }
    })
  })

  // called when page load
  loadLoginRegisterButtons()
})




