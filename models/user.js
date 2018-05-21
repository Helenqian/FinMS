var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/* The user schema attributes / charateristics / fields */
/* 用户模式 属性 / 特性 / 字段 */
var UserSchema = new mongoose.Schema({
	email: { type: String, unique: true, lowercase: true},
	password: String,

	profile: {
		name: { type: String, default: ''},
		picture: { type: String, default: ''}
	},

	address: String,

	//用户权限：管理员admin，操作员operator，审计员auditor，普通用户viewer
	usertype: { type: String, default:'普通用户'}

});


/* Hash the password before we even save it to the database */
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt){ //salt: generating 10 different random data
		if (err) return next(err); //call back
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if (err) return next(err);
			user.password = hash;
			next();
		});
	}); //generate the salt(random data)
});


/* compare password in the database and the one that user type in */
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

/*UserSchema.methods.gravatar = function(size){
	if (!this.size) size = 200;
	if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar' + md5 + '?s=' + size + '&d=retro';
}*/



module.exports = mongoose.model('User', UserSchema);

