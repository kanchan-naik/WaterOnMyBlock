// import Annotation object 
const Annotation = require('../models/annotation')

const  fetchAnnotations = async (req, res) => {
    // Find the annotations
    const annotations = await Annotation.find()

    // Respond with them 
    res.json({ annotations: annotations});
};

const fetchAnnotation = async (req, res) => {
    // Get individual id from the url 
    const annotationId = req.params.id;

    // Find the annotation using that id 
    const annotation = await Annotation.findById(annotationId)
    
    // Respond with the annotation
    res.json({annotation})
};

const createAnnotation = async (req, res) => {
    // get the sent in data off request body 
    const {address, firstName, lastName, description, isAnonymous} = req.body;

    // create an annotation with it 
    const annotation = await Annotation.create({
        address, 
        firstName, 
        lastName, 
        description, 
        isAnonymous
    });

    // respond with a new annotation
    res.json({annotation : annotation});
};

const updateAnnotation = async (req, res) => {
    // Get the id off the url 
    const annotationId = req.params.id; 

    // Get the data off teh request body 
    const {address, firstName, lastName, description, isAnonymous} = req.body;

    // Find and update the record 
    await Annotation.findByIdAndUpdate(annotationId, 
        {
            address, 
            firstName, 
            lastName, 
            description, 
            isAnonymous
        });

    // fetch updated version
    const annotation = await Annotation.findById(annotationId);

    // Respond with the updated annotation
    res.json({annotation})
};

const deleteAnnotation = async (req, res) => {
    // get id off url
    const annotationId = req.params.id; 

    // delete the record
    await Annotation.deleteOne({ _id: annotationId} ) // filter method to find record

    // respond
    res.json({success: "Record deleted"});
};

module.exports = {
    fetchAnnotations, 
    fetchAnnotation,
    createAnnotation, 
    updateAnnotation, 
    deleteAnnotation
}