/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var passwordHash = require('password-hash');

var User = {

  attributes: {

    /* Имя */
    username: {type:'string'},

    /* Пароль */
    password: {type: 'string', required: true, minLength: 5},
    
    admin: {
        type: 'boolean',
        defaultsTo: true
    },

    /*
    role: {
        type: 'string',
        enum: ['customer', 'manager', 'photographer', 'designer', 'admin'],
        defaultsTo: 'admin'
    },
    */

    toJSON: function() {
      	var element = this.toObject();
      	delete element.password;
      	return element;
    }

  },

  beforeCreate: function (values, next) {
    // Создаем зашифрованную запись пароля в БД
    var mainPass = passwordHash.generate(values.password);
    values.encryptPassword = mainPass;
    next();  	
  }

};

module.exports = User;