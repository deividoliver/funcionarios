	'use strict'
	//Require Mongoose
	var mongoose = require('mongoose');

	//Define a schema
	var Schema = mongoose.Schema;

	var schema = new Schema({
	    nome: {type: String, required: true},
	    funcionario:{
	    	criar: {type: Boolean},
	 		ler: {type: Boolean},
	 		alterar: {type: Boolean},
	 		excluir: {type: Boolean}
	    },
	    nivel_de_acesso:{
	    	criar: {type: Boolean},
	 		ler: {type: Boolean},
	 		alterar: {type: Boolean},
	 		excluir: {type: Boolean}
	    },  
	 	
	});

	var Nivel_de_acesso = mongoose.model('Nivel_de_acesso', schema );

	module.exports = Nivel_de_acesso;