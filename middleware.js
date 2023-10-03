const {campgroundSchema, reviewSchema}=require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

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

module.exports.validateCampground=(req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body); 
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor=async(req, res, next)=>{ //checks if the user logged in has permission to modify the campground 
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req, res, next)=>{ //checks if the user logged in has permission to modify the review 
    const {id, reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}