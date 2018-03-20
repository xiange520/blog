var express = require('express');
var router = express.Router();

var User = require('../util/model').User;

/* GET users listing. */

//用户首页
router.get('/', function(req, res, next) {
	var where = {};
	if (req.query.minage && req.query.maxage){
		where.age = {$lt:req.query.maxage,$gt:req.query.minage};	
	}
	if (req.query.username){
		where.username = new RegExp(req.query.username);	
	}
	// where.createdAt
	if (req.query.sex) {
		where.sex = req.query.sex;
	}

	var str = '';
	for(var i in req.query){
		if (i != 'page'){
			str +=  i+'='+req.query[i]+'&';
		}
	}
	User.count(function(err,total){
		if(err){
			next(err);
		} else {
			var page = {};
			page.every = 5;
			page.totalPage = Math.ceil(total/page.every);
			page.nowPage = Number(req.query.page ? req.query.page : 1);
			page.prevPage = page.nowPage - 1 <=1 ? 1 : page.nowPage - 1;
			page.nextPage = page.nowPage + 1 >= page.totalPage ? page.totalPage : page.nowPage + 1; 
			User.find(function(err,users){
				if(err) {
					next(err);
				} else {
					// var moment = require('moment');
					var sex = ['男','女'];
					var position = ['北京市','河南省','河北省','山东省','山西省'];
					res.render('users',{users:users,sex:sex,position:position,page:page,str:str,query:req.query});
				}
			}).where(where).limit(page.every).skip((page.nowPage-1)*page.every);
		}
	}).where(where);
});

//增加用户
router.get('/create', function(req, res, next){
	res.render('users/create');
})

router.post('/create',function(req, res, next){
	req.body.password = require('../util/md5').md5(req.body.password);
	User.create(req.body,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/users');
		}
	})
})

//删除用户
router.get('/remove/:_id',function(req,res,next){
	User.remove(req.params,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/users');
		}
	})
})

//修改用户
router.get('/update/:_id',function(req,res,next){
	User.findOne(req.params,function(err,user){
		if(err){
			next(err);
		} else {
			res.render('users/update',{user:user});
		}
	})
})

router.post('/update',function(req,res,next){
	console.log(req.body);
	User.update({_id:req.body._id},req.body,function(err){
		if(err){
			next(err);
		} else{
			res.redirect('/users');
		}
	})
})

//添加头像
router.get('/avatar/:_id',function(req,res,next){
	User.findOne(req.params,function(err,user){
		if (err){
			next(err);
		} else {
			res.render('users/avatar',{user,user});
		}
	})
})

router.post('/avatar',function(req,res,next){
	var util = require('../util/upload');
	util.upload(req,'./public/uploads').then(function(data){
		User.update(data.fields,{avatar:data.files.avatar.path.slice(6).replace(/\\/g,'/')},function(err){
			if(err){
				next(err);
			} else{
				res.redirect('/users');
			}
		})
	})
})
module.exports = router;
