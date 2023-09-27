const express=require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground}= require('../middleware');


//show all campgrounds
router.get('/', catchAsync(async (req,res)=>{
    const camps= await Campground.find();
    req.flash('success', 'this is the main camgrounds')
    res.render('./campground/index', {camps})
}));
// create new campground form
router.get('/new',isLoggedIn, (req,res)=>{
    res.render('./campground/new')
});
//Create a campground
router.post('/',isLoggedIn, validateCampground, catchAsync(async (req,res)=>{ //Called when the form is sent
    const newCampground=new Campground(req.body.campground);
    newCampground.author=req.user._id;
    await newCampground.save();
    req.flash('success', 'Camp was created successfully');
    console.log(newCampground);
    res.redirect(`/campgrounds/${newCampground._id}`);
}));
//Edit a campground
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(async (req,res)=>{ //Called when button edit is clicked
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground was not found');
        return res.redirect('/campgrounds');
    }
    res.render('./campground/edit', {campground});
}));

//Single campground info
router.get('/:id', catchAsync(async (req,res)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Campground was not found');
        res.redirect('/campgrounds');
    }
    res.render('./campground/show', {campground})
}));
//Update a campground
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(async (req,res)=>{
    const {title, location, image, price, description}=req.body.campground;
    const campground=await Campground.findByIdAndUpdate(req.params.id,{title:title, location:location, image:image,price:price, description:description});
    req.flash('success', 'Camp was edited successfully');
    res.redirect(`./${req.params.id}`);
}));
//delete a campground
router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req,res)=>{ //Called when form delete is executed by the button delete
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

module.exports=router;