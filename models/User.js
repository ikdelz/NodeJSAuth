const mongo = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongo.Schema({
    email : {
        type: String,
        required : [true, 'Please enter an email!'],
        unique: true,
        lowercase : true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password : {
        type : String,
        required: [true, 'Please enter a password!'],
        minlength: [5, 'The password must be 5 characters long']
    }
}, {timestamps: true})

// Fire a function that hashes password before the doc is saved to DB [mongoose hooks]

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()

    // We use this keyword to refer to the local instance of the doc about to be saved
    // console.log(`USer about to be created and saved: ${this}`)
})

// Fire a function after the doc is saved to DB [mongoose hooks]
userSchema.post('save', function(doc, next) {
    console.log(`User created & saved!`)
    next()
})

// Static method to log the user in
userSchema.statics.login = async function(email, password) {

    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('Incorrect password!')
    }
    throw Error('Incorrect email!')
}

module.exports = mongo.model("user", userSchema)