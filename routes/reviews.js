const express=require('express');
const router= express.Router({mergeParams:true}); //Allow to use here the params for get the params from app.js that are passed in the url
const catchAsync=require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {reviewSchema}=require('../schemas.js');
const Review = require('../models/review');


const validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//Create a review
router.post('/',validateReview, catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash('success', 'Camp review was added successfully');
    res.redirect(`/campgrounds/${campground._id}`)

}));
//delete a review
router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const{id, reviewId}=req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Camp review was deleted successfully');
    res.redirect(`/campgrounds/${id}`)
}));

module.exports=router;