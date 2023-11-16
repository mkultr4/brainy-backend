
export const Regex = {
  // tslint:disable-next-line:quotemark max-line-length
  // regex anterior :  /^[a-z0-9._-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/
  email: /^[a-z0-9].[a-z0-9._-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/,
  alfaNumeric: '^([a-zA-Z0-9_-]){3,5}$/',
  numeric: '/^([0-9])$/',
  length: (min: Number, max: Number) => {
    return '^([a-zA-Z0-9_-]){' + min + ',' + max + '}$';
  },
  password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})',
  passwordCustom: /^(?!.* )(?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/,
};

export const Validations = {
  email: (email: String) => {
    return new RegExp(Regex.email, 'g').test(email.toLowerCase());
  },
  length: (value: String, min: Number, max: Number) => {
    return new RegExp(Regex.length(min, max)).test(value.toLowerCase());
  },
  password: (password: String) => {
    console.log('password to validate: ' + password);
    console.log('password regex: ' + Regex.passwordCustom);
    console.log('password validation result: ' + new RegExp(Regex.passwordCustom, 'g').test(password as string));
    return new RegExp(Regex.passwordCustom, 'g').test(password as string);
  },
};

export default {
  Date: {
    now() {
      return new Date().getTime();
    }
  },
  Logger: {
    theme: {
      silly: 'rainbow',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      debug: 'blue',
      error: 'red'
    }
  }
};

