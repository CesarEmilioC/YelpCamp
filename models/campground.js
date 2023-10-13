const mongoose = require("mongoose");
const Review = require("./review");
const Schema=mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId, 
        ref:"User"
    },
    title:{
        type:String,
    },
    price:{
        type: Number, 
    },
    description:{
        type:String,
    },
    geometry: { //FOR MAPBOX
        type:{
            type:String,
            enum: ['Point'],
            requires:true
        }, 
        coordinates:{
            type:[Number], 
            required:true
        }
    },
    location:{
        type:String
    },
    images:[ImageSchema],
    reviews:[
        {
            type:Schema.Types.ObjectId, 
            ref:"Review"
        }
    ], 
});



//This is a middleware triggered when findOneAndDelete used to delete a campground, doc is what was deleted, in this case the campground
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    console.log(doc.reviews);
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
});

module.exports=mongoose.model('Campground', CampgroundSchema);