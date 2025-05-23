const Joi = require("joi");

const validateIncident = (req, res, next) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    dateOfIncident: Joi.date().required(),
    waterDepth: Joi.string().valid("Shallow", "Medium", "Deep", "Extreme").required(),
    waterCauses: Joi.array()
      .items(Joi.string().valid("Rain", "Public sewer backup", "Indoor appliance/pipe issues", "I don't know", "Other"))
      .min(1)
      .required(),
    floodSpread: Joi.array()
      .items(Joi.string().valid("Specific address", "Entire block", "Other"))
      .min(1)
      .required(),
    floodLocation: Joi.string().valid("Building", "Street", "Other").required(),
    waterCleanliness: Joi.string().valid("Yes", "No", "I don't know").required(),
    floodTimeline: Joi.string().valid("1hour", "1-12hour", "12-24hour", "24hour").required(),
    propertyType: Joi.array()
      .items(Joi.string().valid("Residential", "Commercial", "I don't know"))
      .min(1)
      .required(),
    floodVisibility: Joi.string().valid("Show", "Hide").required(),
    otherFloodCause: Joi.string().allow(""), // Allow empty if no "Other" cause
    otherFloodLocation: Joi.string().allow(""), // Allow empty if no "Other" location
    emailAlderman: Joi.boolean().required(), // Whether to send the email to the alderman
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validateIncident;

