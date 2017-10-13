$(function() {
  var main = new Main();
});

function Main() {
  this.userIdForm = $('form#get-survey-offer');
  this.submitButton = this.userIdForm.find('button[type=submit]');
  this.userIdInputField = this.userIdForm.find('[data-form-field=user-id] input');
  this.initEvents();
}

Main.prototype.initEvents = function initEvents() {
  this.submitButton.on('click', this.onSubmitClick.bind(this));
}

Main.prototype.onSubmitClick = function onSubmitClick(e) {
    e.preventDefault();
    var validation = this.validateUserInput();
    if (validation.isValid) {
      // make ajax call
      console.log('isgood');
    } else {
      // show validation
      if (validation.isEmpty) {
console.log('isempty');
      } else if (validation.isLong) {
        console.log('islong');

      }
    }
};

Main.prototype.validateUserInput = function validateUserInput() {
  var validation = {
    isValid: false,
    isEmpty: false,
    isLong: false
  }
  var userInput = this.userIdInputField.val();
  if (userInput.length === 0) {
    validation.isEmpty = true;
  } else if (userInput.length > 32) {
    validation.isLong = true;
  } else {
    validation.isValid = true;
  }

  return validation;
};
