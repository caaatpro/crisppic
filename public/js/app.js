//$.ajaxSetup({
//  beforeSend: function(xhr, settings) {
//    if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE') {
//      function getCookie(name) {
//        var cookieValue = null;
//        if (document.cookie && document.cookie != '') {
//          var cookies = document.cookie.split(';');
//          for (var i = 0; i < cookies.length; i++) {
//            var cookie = jQuery.trim(cookies[i]);
//            if (cookie.substring(0, name.length + 1) == (name + '=')) {
//              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//              break;
//            }
//          }
//        }
//        return cookieValue;
//      }
//      if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
//        xhr.setRequestHeader("x-csrf-token", getCookie('_csrfToken'));
//      }
//    }
//  }
//});
$.ajaxSetup({
  beforeSend: function (xhr) {
    xhr.setRequestHeader('x-csrf-token', $.cookie('_csrfToken'));
  }
});

$(function(){
  $('#addViewModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var title = button.data('title');
    var modal = $(this);
    $('#addViewModalSave').data('movieId', button.data('movieId'));
    modal.find('.modal-title').text('Новый просмотр "' + title + '"');
  });
  $('#addViewModalSave').on('click', function () {
    var $btn = $(this).button('loading');
    var movieId = $(this).data('movieId');
    var viewDate = $('#viewDate').val();
    var viewComment = $('#viewComment').val();
    $.ajax({
      type: "POST",
      url: "/movie/" + movieId,
      data: {'viewComment': viewComment, 'viewDate': viewDate},
      success: function(r){
        $('#viewDate').val('');
        $('#viewComment').val('');
        if (r.success) {
          var alert = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button><strong>Просмотр добавлен!</strong>Добавте ещё один просмотр, либо <a href="#" class="alert-link" data-dismiss="modal">закройте окно.</a></div>';
        } else {
          var alert = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button><strong>Ошибка!</strong>Попробуйте позже.</div>';
          $(this).attr('disabled', 'disabled');
        }
        $('#alerts').html(alert);
        $btn.button('reset');
      }
    });
  })
});

/* SignUp */
$(function(){
  $('#signupButton').on('click', function () {
    var $btn = $(this).button('loading');
    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    $('#alerts').html('');

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: "/signup/",
      data: JSON.stringify({
        'username': username,
        'email': email,
        'password': password
      }),
      success: function(r){
        if (r.success == false) {
          var errors = "";
          if (r.errfor.email == "required") {
            errors += "Не указан email<br>";
          }
          if (r.errfor.password == "required") {
            errors += "Не указан пароль<br>";
          }
          if (r.errfor.username == "required") {
            errors += "Не указано имя пользователя<br>";
          }
          if (r.errfor.username == "username already taken") {
            errors += "Имя пользователя уже занято<br>";
          }
          if (r.errfor.email == "invalid email format") {
            errors += "Не верный формат email<br>";
          }
          if (r.errfor.email == "email already registered") {
            errors += "Пользователь с таким email уже зарегистрирован<br>";
          }
          var alert = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>'+errors+'</div>';
        } else {
          window.location = r.defaultReturnUrl;
        }
        $('#alerts').html(alert);
        $btn.button('reset');
      }
    });
  })
});

/* Login */
$(function(){
  $('#loginButton').on('click', function () {
    var $btn = $(this).button('loading');
    var username = $('#username').val();
    var password = $('#password').val();
    $('#alerts').html('');

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: "/login/",
      data: JSON.stringify({
        'username': username,
        'password': password
      }),
      success: function(r){
        if (r.success == false) {
          var errors = "";
          if (r.errfor.username == "required") {
            errors += "Не указано имя пользователя<br>";
          }
          if (r.errfor.password == "required") {
            errors += "Не указан пароль<br>";
          }
          if (r.errors.length) {
            for (var i=0; i < r.errors.length; i++) {
              errors += r.errors[i]+"<br>";
            }
          }
          var alert = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>'+errors+'</div>';
        } else {
          window.location = r.defaultReturnUrl;
        }
        $('#alerts').html(alert);
        $btn.button('reset');
      }
    });
  })
});


/* Save settings */
$(function(){
  $('#saveAccountSettings').on('click', function () {
    var $btn = $(this).button('loading');
    var sex = $('.sex:checked').val();
    var email = $('#email').val();

    $('#alertsSettings').html('');

    $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: "/account/settings/save/",
      data: JSON.stringify({
        'sex': sex,
        'email': email
      }),
      success: function(r){
        if (r.success == false) {
          var errors = "";

          if (r.errfor.email) {
            errors += r.errfor.email+"<br>";
          }
          if (r.errfor.sex) {
            errors += r.errfor.sex+"<br>";
          }
          var alert = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>'+errors+'</div>';
        } else {
          var alert = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>Изменения сохранены</div>';
        }
        $('#alertsSettings').html(alert);
        $btn.button('reset');
      }
    });
  })
});

/* Save password */
$(function(){
  $('#saveAccountPassword').on('click', function () {
    var $btn = $(this).button('loading');
    var password = $('#password').val();

    $('#alertsPassword').html('');

    $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: "/account/settings/password/",
      data: JSON.stringify({
        'password': password
      }),
      success: function(r){
        if (r.success == false) {
          var errors = "";

          if (r.errfor.password) {
            errors += r.errfor.password+"<br>";
          }
          var alert = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>'+errors+'</div>';
        } else {
          var alert = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Закрыть"><span aria-hidden="true">&times;</span></button>Пароль изменён</div>';
        }
        $('#alertsPassword').html(alert);
        $('#password').val('');
        $btn.button('reset');
      }
    });
  })
});
