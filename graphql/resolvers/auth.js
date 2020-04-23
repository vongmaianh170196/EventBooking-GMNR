
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const User = require('../../models/User')



module.exports = {
    createUser: async args => {
        try {         
            const existed = await User.findOne({email: args.userInput.email})
            if(existed) throw new Error('User is already existed')

            const hashed = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashed
            }) 
            const createdUser = await user.save();
            return {...createdUser._doc, _id: createdUser._id, password: null}
        } catch (error) {
            throw error
        }
    },
    auth: async ({email, password}) => {
        try {            
            const user = await User.findOne({email: email});
            if(!user) throw new Error("User does not exist")
            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual) throw new Error("Invalid password")
            const token = jwt.sign({
                userId: user._id, 
                email: user.email},
                'jwtsecretkey',
                {expiresIn: '1h'}
            )
            return {userId: user._id, token: token, tokenExpiration: 1}
        } catch (error) {
            throw error
        }
    }
}