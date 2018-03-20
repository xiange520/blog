var express = require('express');
var router = express.Router();

var Type = require('../util/model').Type;
var Article = require('../util/model').Article;

/* GET home page. */
router.get('/', async function(req, res, next) {
	try {
		var types = await Type.find();
		var tid = req.query.tid ? req.query.tid : types[0]._id;
		var articles = await Article.find({type:tid});
		var article = {};
		if(req.query.aid){
			for(var i=0; i<articles.length; i++){
				if(articles[i]._id == req.query.aid){
					article = articles[i];
					break;
				}
			}	
		} else {
			article = articles[0];
		}
		res.render('index',{types:types,articles:articles,article:article,tid:tid});
	} catch (err) {
		next(err);
	}
	// Type.find(function(err,types){
	// 	if (err){
	// 		next(err);
	// 	} else {
	// 		var tid = req.query.tid ? req.query.tid : types[0]._id;
	// 		Article.find({type:tid},function(err,articles){
	// 			if(err){
	// 				next(err);
	// 			} else {
	// 				var article = {};
	// 				if(req.query.aid){
	// 					for(var i=0; i<articles.length; i++){
	// 						if(articles[i]._id == req.query.aid){
	// 							article = articles[i];
	// 							break;
	// 						}
	// 					}	
	// 				} else {
	// 					article = articles[0];
	// 				}
	// 				res.render('index',{types:types,articles:articles,article:article,tid:tid});		
	// 			}
	// 		});
	// 	}
	// })
});

module.exports = router;
