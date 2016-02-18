/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	/* Наименоваение */

  	title: { 
  		type:'string' 
  	},

  	/* Описание */
  	
  	description: { 
  		type:'string' 
  	},

  	/* Дата сдачи */

    completionDate: { 
    	type:'datetime' 
    },

    /* Этапы */
    
    stages: {
      type: 'json'
    }

    /*stages: {
    	collection: 'stages',
    	via: 'bind'
    }*/

  }
};

