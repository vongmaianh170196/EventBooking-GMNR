const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // const authHeader = req.get('Authorization');
    // if(!authHeader){
    //     req.isAuth = false;
    //     return next();
    // }
    // const token = authHeader.split(' ')[1];
    // if(!token || token ==''){
    //     req.isAuth = false;
    //     return next()
    // }
    // try {
    //     const decoded = jwt.verify(token, 'jwtsecretkey')
    //     if(!decoded){
    //         req.isAuth = false;
    //         return next()
    //     }
    // } catch (error) {
    //     req.isAuth = false;
    //     return next() 
    // }

    //Get token from header
    const token = req.header('x-auth-token');
    if(!token){
        req.isAuth = false
        return next()
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, 'jwtsecretkey');
        if(!decoded){
            req.isAuth = false;
            return next()
        }
    }catch(err){
        res.status(401).json({msg: "Token is not valid"})
    }
    req.isAuth = true;
    req.userId = decoded.userId;
    next();
}