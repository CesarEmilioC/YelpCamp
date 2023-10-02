const express=require('express');
const router= express.Router({mergeParams:true}); //Allow to use here the params for get the params from app.js that are passed in the url
const catchAsync=require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {reviewSchema}=require('../schemas.js');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware');
const reviews=require('../controllers/reviews'); //Controller for campgrounds tasks


//Create a review
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));
//delete a review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports=router;