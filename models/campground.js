const mongoose = require("mongoose");
const Review = require("./review");
const Schema=mongoose.Schema;

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
    location:{
        type:String
    },
    images:[{
        url:String, 
        filename:String
    }  
    ],
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