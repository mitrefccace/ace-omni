const validator = require('validator');

const LEGAL_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,64}$/;

module.exports = {
  isAbbrValid: (abbr) => {
    let isFormatCorrect = false;
    if (abbr) isFormatCorrect = (abbr.length <= 45 && abbr.length > 1 && validator.isAlpha(abbr));
    // if (!isFormatCorrect) console.log("Abbr Name failed form validation");
    return isFormatCorrect;
  },
  isNameValid: (name) => {
    let isFormatCorrect = false;
    if (name) isFormatCorrect = ((name.length >= 1) && (name.length <= 45));
    // if (!isFormatCorrect) console.log("Name failed form validation");
    return isFormatCorrect;
  },
  isPasswordComplex: (password) => {
    let isFormatCorrect = false;
    if (password) isFormatCorrect = LEGAL_PASSWORD.test(password);
    // if (!isFormatCorrect) console.log("Password failed form validation");
    return isFormatCorrect;
  }
};
