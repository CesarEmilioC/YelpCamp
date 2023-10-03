const express=require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground}= require('../middleware');
const campgrounds=require('../controllers/campgrounds'); //Controller for campgrounds tasks
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); //upload.array is a middleware from cloudinary multer storage

//Render new campground form
router.get('/new',isLoggedIn, campgrounds.renderNewCampground);
//render Edit a campground
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditCampground ));

router.route('/:id')
    .get(catchAsync(campgrounds.renderSingleCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports=router;