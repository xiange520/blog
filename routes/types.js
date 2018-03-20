var express = require('express');
var router = express.Router();

var Type = require('../util/model').Type;

//分类首页
router.get('/',function(req,res,next) {
	Type.find(function(err,types) {
		if(err){
			next(err);
		} else {
			res.render('types',{types:types});
		}
	})
})

//分类增加
router.get('/create',function(req,res,next){
	res.render('types/create');
})

router.post('/create',function(req,res,next){
	Type.create(req.body,function(err){
		if (err){
			next(err);
		} else {
			res.redirect('/types');
		}
	})
})

//分类删除
router.get('/remove/:_id',function (req,res,next){
	console.log(req.params);
	Type.remove(req.params,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/types');
		}
	})
})

//分类修改
router.get('/update/:_id',function(req,res,next){
	Type.findOne(req.params,function(err,type){
		if(err){
			next(err);
		} else {
			res.render('types/update',{type:type});
		}
	})
})

router.post('/update',function(req,res,next){
	Type.update({_id:req.body._id},{typename:req.body.typename},function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/types');
		}
	})
})

module.exports = router;