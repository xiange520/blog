var express = require('express');
var router = express.Router();

var Article = require('../util/model').Article;
var Type = require('../util/model').Type;

//文章首页
router.get('/',function(req,res,next){
	console.log(req.query);
	var where = {};
	if(req.query.articlename){
		where.articlename = new RegExp(req.query.articlename);	
	}
	if(req.query.type){
		where.type = req.query.type;
	}
	Article.count(function (err,total){
		if(err){
			next(err);
		} else {
			var page = {};
			page.every = 5;
			page.totalPage = Math.ceil(total/page.every);
			page.nowPage = Number(req.query.page ? req.query.page : 1);
			page.prevPage = page.nowPage - 1 <= 1 ? 1 : page.nowPage - 1;
			page.nextPage = page.nowPage + 1 >= page.totalPage ? page.totalPage : page.nowPage + 1;
			var str = '';
			for (var i in req.query){
				if (i != 'page'){
					str += i + '=' + req.query[i] + '&';	
				}
			}
			Article.find(function(err,articles){
				console.log(articles);
				if(err){
					next(err);
				} else {
					Type.find(function(err,types){
						if(err){
							next(err);
						} else {
							res.render('articles',{articles:articles,query:req.query,page:page,str:str,types:types});	
						}
					})
				}
			}).populate('type').where(where).limit(page.every).skip((page.nowPage-1)*page.every);
		}
	}).where(where);
})

//文章添加页
router.get('/create',function(req,res,next){
	Type.find(function(err,types){
		if (err){
			next(err);
		} else {
			res.render('articles/create',{types:types});
		}
	})
})

router.post('/create',function(req,res,next){
	Article.create(req.body,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})

//文章删除
router.get('/remove/:_id',function(req,res,next){
	Article.remove(req.params,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})

//文章修改
router.get('/update/:_id',function(req,res,next){
	Article.findOne(req.params,function(err,article){
		console.log(article);
		if(err){
			next(err);
		} else {
			Type.find(function(err,types){
				if (err){
					next(err);
				} else {
					res.render('articles/update',{article:article,types:types});	
				}
			})
		}
	})
})

router.post('/update',function(req,res,next){
	Article.update({_id:req.body._id},req.body,function (err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})
module.exports = router;