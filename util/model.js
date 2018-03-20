var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username: String,
	password: String,
	age: Number,
	sex: String,
	likes: Array,
	position: String,
	avatar: String,
	intro: String
},{timestamps:true});
exports.User = mongoose.model('User',UserSchema);

var TypeSchema = new Schema({
	typename: String
},{timestamps:true})

exports.Type = mongoose.model('Type',TypeSchema);


var ArticleSchema = new Schema({
	articlename: String,
	content: String,
	type: {type: Schema.Types.ObjectId, ref:'Type'}
},{timestamps:true})

exports.Article = mongoose.model('Article',ArticleSchema);