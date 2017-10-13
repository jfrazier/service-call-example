$(function() {
  var main = new Main();
});

// Main
function Main() {
  this.userIdForm = new SurveyForm('form#get-survey-offer');
}

// Form
function SurveyForm (formSelector) {
  this.form = $(formSelector);
  this.submitButton = new SubmitButton(this.form, 'button[type=submit]');
  this.userIdField = new UserIdField(this.form, '[data-form-field=user-id]')
  this.submitButton.addOnSubmitHandler(this.userIdField);
}

// User Id Field
function UserIdField ($form, selector) {
  this.formField = $form.find(selector);
  this.input = this.formField.find('input');
  this.validations = this.formField.find('[data-validations]');
}

UserIdField.prototype.validate = function validate () {
  this.hideValidations();
  var isValid = false;
  var userInput = this.input.val();
  if (userInput.length === 0) {
    this.showValidation('empty');
  } else if (userInput.length > 32) {
    this.showValidation('long');
  } else {
    isValid = true;
  }
  return isValid;
};

UserIdField.prototype.hideValidations = function hideValidations() {
  this.validations.children().addClass('hidden');
};

UserIdField.prototype.showValidation = function showValidation(key) {
  this.validations.find('[data-validation=' + key + ']').removeClass('hidden');
};

UserIdField.prototype.hideResponses = function hideResponses() {
  this.formField.find('[data-responses]').children().addClass('hidden');
};

UserIdField.prototype.showResponse = function showResponse(response, data) {
  if (data !== null) {
    console.log(data);
    this.formField.find('[data-survey-link] a').attr('href', data.offer_url);
    this.formField.find('[data-currency] span').text(data.message_hash.currency);
    this.formField.find('[data-min] span').text(data.message_hash.min);
    this.formField.find('[data-max] span').text(data.message_hash.max);
  }

  this.formField.find('[data-response=' + response + ']').removeClass('hidden');
};

// Submit Button
function SubmitButton ($form, selector) {
  this.form = $form;
  this.submitButton = $form.find(selector);
}

SubmitButton.prototype.addOnSubmitHandler = function addOnSubmitHandler(userIdField) {
  this.userIdField = userIdField;
  this.submitButton.on('click', this.onSubmitClick.bind(this));
};

SubmitButton.prototype.onSubmitClick = function onSubmitClick(e) {
  e.preventDefault();
  this.userIdField.hideResponses();

  if (this.userIdField.validate()) {
    var method = this.form.attr('method');
    var action = this.form.attr('action');
    $.ajax({
      method: method,
      url: action,
      data: {
        api_token: '9a7fb35fb5e0daa7dadfaccd41bb7ad1',
        user_identifier: this.userIdField.input.val()
      },
      dataType: 'jsonp',
      context: this,
      complete: this.onComplete
    });
  }
};

SubmitButton.prototype.onComplete = function onComplete(xhr, status) {
  var data = xhr.responseJSON || {};
  var statuses = ['success', 'error', 'timeout'];
  if (statuses.includes(status)) {
    this.responses[status](data, this.userIdField);
  } else {
    this.responses['unexpected'](data, this.userIdField);
  }
};

SubmitButton.prototype.responses = {
  success: function(data, userIdField) {
    if (data.has_offer) {
      userIdField.showResponse('has_offer', data);
    } else {
      userIdField.showResponse('no_offer', null);
    }
  },
  timeout: function (data, userIdField) {
    userIdField.showResponse('timeout', null);
  },
  error: function (data, userIdField) {
    userIdField.showResponse('error', null);
  },
  unexpected: function (data, userIdField) {
    userIdField.showResponse('unexpected', null);
  }
};
