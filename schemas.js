//File for server side validations, we have handled validations with bootstrp on the ui but people can still make request in other ways and put data in the wrong way and this should not happen

const Joi=require('joi');
module.exports.campgroundSchema= Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(0).max(5),
        body:Joi.string().required()
    }).required()
})