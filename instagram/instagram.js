const client_id = '6df951cdbb9f4c3898408c618014b0de';
const redirect_uri = 'http://jboctor.com/instagram/';
//const redirect_uri = 'http://localhost:8000/instagram/';
const api_url = 'https://api.instagram.com';
const version = '/v1';
const authorize_endpoint = '/oauth/authorize/';
const access_owner_info_endpoint = '/users/self/';
const access_owner_recent_media_endpoint = '/users/self/media/recent/';
const response_type = 'token';

var logged_in;
var access_token;

var instagram = {
  redirectToAuthorize : function () {
    var redirect_url = api_url + authorize_endpoint + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type;
    window.location.href = redirect_url;
  },

  verifyAuthorization : function () {
    var url = window.location.href.split('#access_token=');
    if (url.length == 2) {
      access_token = url.pop();
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

  getRecentMedia : function () {
    var recent_media_url = api_url + version + access_owner_recent_media_endpoint + '?access_token=' + access_token + '&callback=?';
    $.ajax({
      url: recent_media_url,
      type: 'GET',
      dataType: 'jsonp',
      success: function (data) {
        switch (data.meta.code) {
          case 200:
            instagram.displayMedia(data);
            break;
          default:
            instagram.displayUnknownError();
            break;
        }
      }
    });
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
  },

  displayUnknownError : function () {
    $('#error-msg').text('Sorry, an unknown error occured.');
    $('#error').removeClass('invisible');
  },

  displayMedia : function (data) {
    var row_count = 0;
    data.data.forEach(function (element) {
      if (row_count % 4 == 0) {
        $('#user-photos').append('<div class="row text-center pt-2"></div>');
      }
      row_count++;
      $('#user-photos').children()
        .last()
        .append(
          '<div class="col">' +
            '<img src="' + element.images.low_resolution.url + '" class="img-thumbnail"></img>' +
          '</div>'
        );
    });
    $('#user-photos').removeClass('invisible');
  }
};

instagram.verifyAuthorization();
instagram.getRecentMedia();
