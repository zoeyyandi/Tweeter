module.exports = function generateRandomString(length) {
    var string = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return string;
  }