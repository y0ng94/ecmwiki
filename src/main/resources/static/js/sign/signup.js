$(function() {
  passwordValid();
});

function passwordValid() {
  $('#passwordMatchedAlert').css('display', 'none');
  $('#btnRegister').attr('disabled', false);

  $('#userPw, #userPwValid').on('keyup', function () {
    if ($('#userPw').val() === $('#userPwValid').val()) {
      $('#passwordMatchedAlert').css('display', 'none');
      $('#btnRegister').attr('disabled', false);
    } else {
      $('#passwordMatchedAlert').css('display', 'block');
      $('#btnRegister').attr('disabled', true);
    }
  });
};