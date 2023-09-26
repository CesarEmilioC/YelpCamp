module.exports.isLoggedIn=(req, res, next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

//Create this middleware so if session has a returnTo then it is passed to res.locals to be used.
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}