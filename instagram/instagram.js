const client_id = '6df951cdbb9f4c3898408c618014b0de';
const redirect_uri = 'http://localhost:8000/instagram';
const api_url = 'https://api.instagram.com';
const version = '/v1';
const authorize_endpoint = '/oauth/authorize/';
const access_owner_info_endpoint = '/users/self/';
const response_type = 'token';

var logged_in;

var instagram = {
  redirectToAuthorize : function () {
    var redirect_url = api_url + authorize_endpoint + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type;
    window.location.href = redirect_url;
  },

  verifyAuthorization : function () {
    var url = window.location.href.split('#access_token=');
    if (url.length == 2) {
      var access_token = url.pop();
      var user_info_url = api_url + version + access_owner_info_endpoint + '?access_token=' + access_token + '&callback=?';
      $.ajax({
        url: user_info_url,
        type: 'GET',
        dataType: 'jsonp',
        success: function (data) {
          instagram.handleAuthorization(data);
        }
      });
    } else {
      instagram.redirectToAuthorize();
    }
  },

  handleAuthorization : function (data) {
    switch (data.meta.code) {
      case 200:
        instagram.displayUserInfo(data);
        break;
      case 400:
        instagram.displayError(data);
        break;
      default:
        instagram.displayUnknownError();
        break;
    }
  },

  displayUserInfo : function (data) {
    $('#user-name').text(data.data.full_name);
    $('#user-photo-img').attr('src', data.data.profile_picture);
    $('#user-info').removeClass('invisible');
  },

  displayError : function (data) {
    $('#error-msg').text(data.meta.error_message);
    $('#error').removeClass('invisible');
  }
};

instagram.verifyAuthorization();
