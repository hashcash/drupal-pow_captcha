<?php

function pow_captcha_settings_form() {
  $items = array();

  $items['pow_captcha_complexity'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Proof-of-Work Complexity'),
    '#default_value' => variable_get('pow_captcha_complexity', 0.00001),
    '#description'   => t('Higher this value - longer user have to wait before submitting form. Good base line value would be 0.00001'),
    '#required'      => TRUE,
  );

  $items['pow_captcha_key'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Proof-of-Work Key'),
    '#default_value' => variable_get('pow_captcha_key'),
    '#description'   => t('API Key - obtain on http://hashcash.io/dashboard'),
    '#required'      => TRUE,
  );

  return system_settings_form($items);
}
