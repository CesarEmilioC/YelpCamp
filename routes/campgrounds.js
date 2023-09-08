const express=require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema}=require('../schemas.js');

const validateCampground=(req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//show all campgrounds
router.get('/', catchAsync(async (req,res)=>{
    const camps= await Campground.find();
    res.render('./campground/index', {camps})
}));
// create new campground form
router.get('/new',(req,res)=>{
    res.render('./campground/new')
});
//post for sending data
router.post('/', validateCampground, catchAsync(async (req,res)=>{ //Called when the form is sent
    console.log(req.body.campground);
    const {title, location, image, price, description}=req.body.campground; //In the new.ejs form we have title and location encapsulated in the campground[attribute]
    const newCampground=new Campground({title:title, location:location, image:image, price:price, description:description});
    let thiscamp=await newCampground.save();
    console.log(thiscamp);
    //res.redirect(/${thiscamp._id}`);
}));
//Edit a campground
router.get('/:id/edit', catchAsync(async (req,res)=>{ //Called when button edit is clicked
    const campground=await Campground.findById(req.params.id);
    res.render('./campground/edit', {campground});
}));

//Single campground info
router.get('/:id', catchAsync(async (req,res)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews');
    res.render('./campground/show', {campground})
}));
//Update a campground
router.put('/:id', validateCampground, catchAsync(async (req,res)=>{
    const {title, location, image, price, description}=req.body.campground;
    await Campground.findByIdAndUpdate(req.params.id,{title:title, location:location, image:image,price:price, description:description});
    res.redirect(`./${req.params.id}`);
}));
//delete a campground
router.delete('/:id', catchAsync(async (req,res)=>{ //Called when form delete is executed by the button delete
    const campground=await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

module.exports=router;