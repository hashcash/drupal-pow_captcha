(function($) {
  var serverUrl;
  var working = false;
  var badBrowser = false;

  if (navigator.appName.indexOf("Internet Explorer") != -1) {
      badBrowser = true;

      var badBrowser = (
          navigator.appVersion.indexOf("MSIE 1") == -1  //v10, 11, 12, etc. is fine too
      );
  }

  Drupal.behaviors.pow_captcha = {
    attach: function(c) {
      serverUrl = Drupal.settings.pow_captcha.server_url;
      $("form input[name='pow_captcha']").once('pow_captcha', attach_pow_captcha);
    }
  };

  function attach_pow_captcha() {
    var form = $(this).parents('form').first();

    form.addClass("pow-captcha-attached");

    $(".form-actions input[type='submit']", form).each(function() {
      var b = $(this);
      if (! b.attr('disabled')) {
        b.data('pow-captcha-disabled', true);
        b.attr('disabled', 'disabled').addClass("form-button-disabled");
      }
    });

    if (badBrowser) {
        $(".pow-captcha-ie-warning", form).show();
        $(".pow-captcha-progress-wrapper", form).hide();
        $('input[name="pow_captcha_enable_buttons"]', form).parents('.form-item').first().hide();
        return;
    }

    // Attach work call whenever user interact with form
    $("input", form).one('focus', function() { work(form) });
    $('input[name="pow_captcha_enable_buttons"]', form).one('click', function() { work(form) });
  }

  function work(form) {
    if (working) return;
    working = true;

    // Hide checkbox and show progress bar
    $('input[name="pow_captcha_enable_buttons"]', form).parents('.form-item').first().hide();
    $(".pow-captcha-progress-wrapper").show();
    var pb = new Drupal.progressBar('pow-captcha-progress-bar');
    $(pb.element).appendTo( form.find('.pow-captcha-progress') );
    pb.setProgress("0", Drupal.t("Generating Proof-of-Work..."));

    var input = $(this);
    var form_build_id = $("input[name='form_build_id']", form).val();

    var pow = new POW(
      Drupal.settings.pow_captcha.key,
      serverUrl,
      Drupal.settings.pow_captcha.worker_url
    );

    pow.setLimit( Drupal.settings.pow_captcha.complexity );

    pow.setDoneCallback(function() {
      // Hide captcha
      setTimeout(function() {
        $(".pow-captcha-progress-wrapper", form).hide();
        $("fieldset.captcha", form).slideUp('fast');
      }, 500);

      // Enable submit buttons
      $(".form-actions input[type='submit']", form).each(function() {
        var b = $(this);
        if (b.data('pow-captcha-disabled')) {
          b.removeAttr("disabled").removeClass("form-button-disabled");
        }
      });
    });

    pow.setWorkProgressCallback(function(doneCount) {
      var percentage = Math.floor( doneCount / Drupal.settings.pow_captcha.complexity * 100 );
      if (percentage >= 100) {
        pb.setProgress(100, Drupal.t("Done."));
      }
      else {
        pb.setProgress(percentage, Drupal.t("Generating Proof-of-Work..."));
      }
    });

    pow.work(form_build_id);
  }

})(jQuery);


