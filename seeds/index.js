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
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp= new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)}, ${sample(places)}`,image: "https://source.unsplash.com/collection/483251", description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium incidunt omnis, cum illum laboriosam cupiditate voluptatem eveniet, earum atque temporibus iste dolorem tempore? Quis quas neque commodi possimus fugiat facilis.", price:price
        });
        await camp.save();   
    };
    

};

seedDB()

    