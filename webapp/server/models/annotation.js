// import dependencies
const mongoose = require("mongoose");

// Base Schema
const annotationSchema = new mongoose.Schema({
    address: String, 
    firstName: String, 
    lastName: String, 
    description: String, 
    isAnonymous: Boolean
});

const Annotation = mongoose.model('Annotation', annotationSchema)

module.exports = Annotation;