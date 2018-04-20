	'use strict'
	//Require Mongoose
	var mongoose = require('mongoose');

	//Define a schema
	var Schema = mongoose.Schema;

	var schema = new Schema({
	    nome: {type: String},  
	 	email: {type: String, unique: true}, 
	 	telefone: {type: Number, required: [true, 'Numero de telefone requerido']},
	 	_nivel_de_acesso:  { type: mongoose.Schema.Types.ObjectId, ref: 'nivel_de_acessos' }
	});

	var Funcionario = mongoose.model('Funcionario', schema );

	module.exports = Funcionario;