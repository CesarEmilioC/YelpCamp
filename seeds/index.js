//The seeds folder is going to be executed separately from our app because it is just to fill places.
const mongoose=require('mongoose');
const Campground = require('../models/campground');
const cities=require('./cities');
const {descriptors, places}=require('./seedHelpers');

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

const sample=array=> array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    
    
    for(let i=0; i<50;i++){
        console.log("doing");
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp= new Campground({
            author:"650dbb8ffe528bda9234d628",
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)}, ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dnq71sjfn/image/upload/v1696351144/YelpCamp/eedkyawqdspg2iwp6q3y.jpg',
                  filename: 'YelpCamp/eedkyawqdspg2iwp6q3y',
                },
                {
                  url: 'https://res.cloudinary.com/dnq71sjfn/image/upload/v1696351144/YelpCamp/o3f7gatq7gbagu5pfqsh.jpg',
                  filename: 'YelpCamp/o3f7gatq7gbagu5pfqsh',
                }
              ], 
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium incidunt omnis, cum illum laboriosam cupiditate voluptatem eveniet, earum atque temporibus iste dolorem tempore? Quis quas neque commodi possimus fugiat facilis.", 
            price:price
        });
        await camp.save();   
    };
    

};

seedDB()

    