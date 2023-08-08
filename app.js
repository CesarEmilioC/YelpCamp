const express= require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const Campground = require('./models/campground');
const catchAsync=require('./utils/catchAsync');
const {campgroundSchema, reviewSchema}=require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

//Connection to the database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
    .then(()=>{
        console.log("Database connected")
    })
    .catch(err =>{
        console.log('Could not connect to database', err)
    })


app.set('views', path.join(__dirname, 'views')); //Set the views folder where the html will be
app.set('view engine', 'ejs'); //Needed to indicate that ejs will be the template
app.engine('ejs', ejsMate);

//MIDDLEWARE
app.use(express.urlencoded({extended:true})); //This is needed to parse the req.body (What it does is every single request is being url encoded by express function)
app.use(methodOverride('_method'));//To be able to fake PUT or PATCH requests


//SERVER SIDE VALIDATIONS
const validateCampground=(req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//ROUTES
//main
app.get('/', (req,res)=>{
    res.send("hello")
});
//show all campgrounds
app.get('/campgrounds', catchAsync(async (req,res)=>{
    const camps= await Campground.find();
    res.render('./campground/index', {camps})
}));
// create new campground form
app.get('/campgrounds/new',(req,res)=>{
    res.render('./campground/new')
});
//post for sending data
app.post('/campgrounds', validateCampground, catchAsync(async (req,res)=>{ //Called when the form is sent
    console.log(req.body.campground);
    const {title, location, image, price, description}=req.body.campground; //In the new.ejs form we have title and location encapsulated in the campground[attribute]
    const newCampground=new Campground({title:title, location:location, image:image, price:price, description:description});
    let thiscamp=await newCampground.save();
    console.log(thiscamp);
    //res.redirect(`campgrounds/${thiscamp._id}`);
}));
//Edit a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{ //Called when button edit is clicked
    const campground=await Campground.findById(req.params.id);
    res.render('./campground/edit', {campground});
}));

//Single campground info
app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews');
    res.render('./campground/show', {campground})
}));
//Update a campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res)=>{
    const {title, location, image, price, description}=req.body.campground;
    await Campground.findByIdAndUpdate(req.params.id,{title:title, location:location, image:image,price:price, description:description});
    res.redirect(`./${req.params.id}`);
}));
//delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{ //Called when form delete is executed by the button delete
    const campground=await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews',validateReview, catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}));
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
    const{id, reviewId}=req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId)
    res.redirect(`/campgrounds/${id}`)
}));

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    console.log(err);
    res.status(statusCode).render('error', {err:err})
})

//Server
app.listen(3000, ()=>{
    console.log('App listening on port 3000')
});