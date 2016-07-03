var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema   = mongoose.Schema;

// SCHEMA
var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    profile: {
        name: { type: String, default: ''},
        picture: { type: String, default: ''}
    },

    address: String,
    history: [{
        paid: { type: Number, default: 0 },
        item: { type: Schema.Types.ObjectId, ref: 'Product' }
    }]
});

// PASSWORD HASH
UserSchema.pre('save', function(next) {
    var user = this; // store user obj
    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function(err, salt) {
        if(err) {return next(err);}

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {return next(err);}

            user.password = hash;
            next();
        });
    });
});

// COMPARE PASSWORD CUSTOM METHOD
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // this.password = User obj
};

UserSchema.methods.gravatar = function(size) {
    if(!this.size) { size = 200; }
    if(!this.mail) { return 'https://gravatar.com/avatar/?s' + size + '&d=retro'; }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '&s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema);
