/**
* Stages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  attributes: {

  	/* Наименование  */
  	
  	'title': { 
  		type: 'string'
  	},

  	/* Описание */
  	
  	'description': { 
  		type: 'string'
  	},

  	/* Номер этапа */
  	
  	'step': { 
  		type: 'integer'
  	},

  	/* Проект */
  	
  	bind: {
  		model: 'project'
  	}

  }
};

