'use strict'
var express = require('express');
var router = express.Router();
var Nivel_de_acesso = require('../models/nivel_de_acessos')


router.get('/', function(req, res, next) {
  Nivel_de_acesso.find({}, function(err, result) {
    if(!err && result){
    	req.options = {};
    	req.options.nivel_de_acessos = result;
    	req.options.title = 'Nivel de acesso';
    	req.options.mensagem = req.session.mensagem;
    	req.session.mensagem = '';
    	res.render('./nivel_de_acesso/index', req.options);
    }    
  });    
});

router.get('/cadastrar', function(req, res, next){
		req.options = {};
		req.options.title = 'Cadastrar';
		res.render('./nivel_de_acesso/cadastrar', req.options);
});


router.post('/cadastrar', function(req, res, next){
	new Nivel_de_acesso(req.body).save(function(err){
		if(err){
			req.session.mensagem = 'Erro ao salvar registro.';
		}else{
			req.session.mensagem = 'Sucesso ao salvar registro.';
		}
		res.redirect('/nivel_de_acesso');
	});

}); 

router.get('/:id', function(req, res, next){
	Nivel_de_acesso.findOne({ _id: req.params.id}, function(err, result){
		req.options = {};
		req.options.title = 'Alterar';

		if(!err && result)
			req.options.nivel_de_acesso = result;
		res.render('./nivel_de_acesso/alterar', req.options);
	});
}); 


 
router.post('/:id', function(req,res,next){
	 req.options = {};
	 Nivel_de_acesso.findOneAndUpdate({_id: req.body._id}, req.body, function(err, result){
	 	if(err)
	 		req.session.mensagem = 'Houve um erro ao tentar salvar os dados<br/>'+err;
	    else
	 		req.session.mensagem = 'Sucesso ao salvar registro';
	 	res.redirect('/nivel_de_acesso')	
	 });
});

router.get('/deletar/:id', function(req, res, next){
	Nivel_de_acesso.findOneAndRemove({_id: req.params.id}, function(err){
	 	if(err)
	 		req.session.mensagem = 'Houve um erro ao tentar excluir os dados<br/>'+err;
	    else
	 		req.session.mensagem = 'Sucesso ao excluir registro';
	 	res.redirect('/nivel_de_acesso')
	});
});
 
module.exports = router;