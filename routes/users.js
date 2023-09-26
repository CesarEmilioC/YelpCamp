const express=require('express');
const router= express.Router();
const User= require("../models/user");
const catchAsync = require('../utils/catchAsync');
const passport=require("passport");
const { storeReturnTo } = require('../middleware');


router.get("/register", (req, res)=>{
    res.render('users/register')
});
router.get("/login", (req, res)=>{
    res.render('users/login')
});

router.post("/register", catchAsync(async(req, res)=>{
    try{
        const {email, username, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser= await User.register(newUser, password);

        req.login(registeredUser, err=>{ //Function of passport to login a user manually the idea was to log in the user after registered automatically
            if (err) return next(err);
            req.flash('success', 'welcome to yelpcamp')
            res.redirect('/campgrounds');
        })
        
    } catch (e){
        req.flash('error', e.message);
        res.redirect('register');
    }

    
}));

router.post("/login",storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),(req, res)=>{
    req.flash('success', 'welcome to yelpcamp');
    const redirectUrl=res.locals.returnTo || '/campgrounds'; //If the user was taken to login, after logging in it has to direct him to the page he was before
    res.redirect(redirectUrl);
    
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully Logged out');
        res.redirect('/campgrounds');
    });
}); 

module.exports=router;