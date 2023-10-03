
if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express= require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User= require('./models/user');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');

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
app.use(express.static(path.join(__dirname, 'public')));

//FOR SESSION MANAGEMENT
const sessionConfig={
    secret:"tomasSecret", 
    resave:false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7, 
        maxAge:1000*60*60*24*7

    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser=req.user; //passport funciton that has the user infomation that is logged in or undefined
    next();
})

app.use('/campgrounds', campgroundRoutes);//Whenever /campgrounds is hit use the routes in campgrounds routes
app.use('/campgrounds/:id/reviews', reviewRoutes);//Whenever /campgrounds/:id/reviews is hit use the routes in reviews routes
app.use('/', userRoutes);

//ROUTES
//main
app.get('/', (req,res)=>{
    res.send("hello")
});

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

