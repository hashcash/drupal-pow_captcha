/* global Drupal, jQuery */
(function($) {
  var badBrowser = false;

  if (navigator.appName.indexOf("Internet Explorer") != -1) {
      badBrowser = (
          navigator.appVersion.indexOf("MSIE 1") == -1  //v10, 11, 12, etc. is fine too
      );
  }

  Drupal.behaviors.pow_captcha = {
    attach: function(c) {
      $("form input[name='pow_captcha']", c).once('pow_captcha', attach_pow_captcha);
    }
  };

  function attach_pow_captcha() {
    var $form = $(this).parents('form').first();

    if (badBrowser) {
        $(".pow-captcha-ie-warning", $form).show();
        return;
    }

    $form.addClass('pow-captcha-attached');

    var $button = $form.find("input[type=submit]").eq(0);

    $button.hashcash({
        autoId: false,
        hashcashInputName: "form_build_id",
        key: Drupal.settings.pow_captcha.key,
        complexity: Drupal.settings.pow_captcha.complexity
    });
  }

})(jQuery);


