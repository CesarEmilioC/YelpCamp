const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

//Render Campgrounds
module.exports.index=async (req,res)=>{
    const camps= await Campground.find();
    res.render('./campground/index', {camps})
};

//Render new Campground
module.exports.renderNewCampground=(req,res)=>{res.render('./campground/new');};

//Create a campground
module.exports.createCampground= async (req,res)=>{ //Called when the form is sent
    
    const newCampground=new Campground(req.body.campground);
    newCampground.images=req.files.map(f=>({ url: f.path, filename: f.filename}))
    newCampground.author=req.user._id;
    await newCampground.save();
    req.flash('success', 'Camp was created successfully');
    console.log(newCampground);
    res.redirect(`/campgrounds/${newCampground._id}`);
};

//Render Edit a campground
module.exports.renderEditCampground=async (req,res)=>{ //Called when button edit is clicked
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground was not found');
        return res.redirect('/campgrounds');
    }
    res.render('./campground/edit', {campground});
};

//Render a campground
module.exports.renderSingleCampground=async (req,res)=>{
    const campground= await Campground.findById(req.params.id).populate({
        path:'reviews', 
        populate:{
            path: 'author'
        }
    }).populate('author'); //This line populates the reviews but also populating the authors of each review, then t populates the author of the campground

    if(!campground){
        req.flash('error', 'Campground was not found');
        res.redirect('/campgrounds');
    }
    res.render('./campground/show', {campground})
}

//Update a campground
module.exports.updateCampground= async(req,res)=>{
    const {title, location, image, price, description}=req.body.campground;
    const campground=await Campground.findByIdAndUpdate(req.params.id,{title:title, location:location, image:image,price:price, description:description});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Camp was edited successfully');
    res.redirect(`./${req.params.id}`);
}

//Dlete a campground
module.exports.deleteCampground=async (req,res)=>{ //Called when form delete is executed by the button delete
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}

//Delete an image
module.exports.deleteImage=async (req,res)=>{ //Called when form delete is executed by the button delete
    const filename=req.body.filename;
    console.log("Request done to delete image", req.params.imageNumber);
    const campground= await Campground.findById(req.params.id);
    await cloudinary.uploader.destroy(filename);
    await campground.updateOne({ $pull: { images: { filename: filename } } });
    res.redirect(`/campgrounds/${req.params.id}/edit`)
}