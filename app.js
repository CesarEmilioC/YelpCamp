const express= require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const Campground = require('./models/campground');

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

app.use(express.urlencoded({extended:true})); //This is needed to parse the req.body
app.use(methodOverride('_method'));//To be able to fake PUT or PATCH requests

//ROUTES
//main
app.get('/', (req,res)=>{
    res.send("hello")
});
//show all campgrounds
app.get('/campgrounds', async (req,res)=>{
    const camps= await Campground.find();
    res.render('./campground/index', {camps})
});
// create new campground form
app.get('/campgrounds/new', async (req,res)=>{
    res.render('./campground/new')
});
//post for sending data
app.post('/campgrounds', async (req,res)=>{ //Called when the form is sent
    const {title, location}=req.body.campground; //In the new.ejs form we have title and location encapsulated in the campground[attribute]
    const newCampground=new Campground({title:title, location:location});
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);
});
//Edit a campground
app.get('/campgrounds/:id/edit', async (req,res)=>{ //Called when button edit is clicked
    const campground=await Campground.findById(req.params.id);
    res.render('./campground/edit', {campground});
});

//Single campground info
app.get('/campgrounds/:id', async (req,res)=>{
    const camp= await Campground.findById(req.params.id);
    res.render('./campground/show', {camp})
});
//Update a campground
app.put('/campgrounds/:id', async (req,res)=>{
    const {title, location}=req.body.campground;
    await Campground.findByIdAndUpdate(req.params.id,{title:title, location:location});
    res.redirect(`./${req.params.id}`);
});
//delete
app.delete('/campgrounds/:id', async (req,res)=>{ //Called when form delete is executed by the button delete
    const campground=await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
});



app.get('/makeCampground', async (req,res)=>{
    const camp=new Campground({
        title: 'MyBACKYARD',
        price:"50",
        description:"my campground",
        location:"Dont know"
    });
    await camp.save()
    res.send(camp)
});

//Server
app.listen(3000, ()=>{
    console.log('App listening on port 3000')
});