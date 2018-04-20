'use strict'
var express = require('express');
var router = express.Router();
var Funcionario = require('../models/funcionarios');
var Nivel_de_acesso = require('../models/nivel_de_acessos');


router.get('/', function(req, res, next) {
  Funcionario.find({}, function(err, result) {
    if(!err && result){
    	req.options = {};
    	req.options.funcionarios = result;
    	req.options.title = 'Funcionarios';
    	req.options.mensagem = req.session.mensagem;
    	req.session.mensagem = '';
    	res.render('./funcionario/index', req.options);
    }    
  });    
});

router.get('/cadastrar', function(req, res, next){
	req.options = {};
	req.options.title = 'Cadastrar';
	Nivel_de_acesso.find({}, function(err, result){
		if(!err){
			req.options.nivel_de_acesso = result;
		}
		res.render('./funcionario/cadastrar', req.options);	
	});
		
});


router.post('/cadastrar', function(req, res, next){
	console.log(req.body);
	new Funcionario(req.body).save(function(err){
		if(err){
			req.session.mensagem = 'Erro ao salvar funcionario.';
		}else{
			req.session.mensagem = 'Sucesso ao salvar funcionario.';
		}
		res.redirect('/funcionario');
	});

});

router.get('/:id', function(req, res, next){
	Funcionario.findOne({ _id: req.params.id}, function(err, result_funcionario){
		req.options = {};
		req.options.title = 'Alterar';

		if(!err && result_funcionario){
			req.options.funcionario = result_funcionario;
		}

		Nivel_de_acesso.find({}, function(err, result_nivel_de_acessos){
			if(!err){
				
				req.options.nivel_de_acesso = result_nivel_de_acessos;

			}
			res.render('./funcionario/alterar', req.options);
		});
		
	});
});


 
router.post('/:id', function(req,res,next){
 	 req.options = {};
	 Funcionario.findOneAndUpdate({_id: req.body._id}, req.body, function(err, result){
	 	if(err)
	 		req.session.mensagem = 'Houve um erro ao tentar salvar os dados<br/>'+err;
	    else
	 		req.session.mensagem = 'Sucesso ao salvar funcionario';
	 	res.redirect('/funcionario')	
	 });
});


router.get('/deletar/:id', function(req, res, next){
	Funcionario.findOneAndRemove({_id: req.params.id}, function(err){
	 	if(err)
	 		req.session.mensagem = 'Houve um erro ao tentar excluir os dados<br/>'+err;
	    else
	 		req.session.mensagem = 'Sucesso ao excluir funcionario';
	 	res.redirect('/funcionario')
	});
});
 
module.exports = router;