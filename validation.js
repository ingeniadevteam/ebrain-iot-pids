"use strict";

const joi = require('joi');

// the validation schema
const pidSchema = joi.object({
  name: joi.string(),               // Pid name
  k_p: joi.number().default(0),     // Proportional gain
  k_i: joi.number().default(0),     // Integral gain
  k_d: joi.number().default(0),     // Derivative gain
  dt: joi.number().default(1000),   // Time interval in milliseconds
}).unknown().required();

const pidsSchema = joi.array().items(pidSchema);

module.exports = async function (pidArray) {
  // validate the config object
  const validation = pidsSchema.validate(pidArray || {});
  if (validation.error) {
    const errors = [];
    validation.error.details.forEach( detail => {
      errors.push(detail.message);
    });
    // process failed
    throw new Error(`pids validation error: ${errors.join(", ")}`);
  }

  return validation.value;
};
