"use strict";

const joi = require('joi');

// the validation schema
const pidSchema = joi.object({
  name: joi.string(),               // Pid name
  kp: joi.number().default(0.5),    // Proportional gain
  ki: joi.number().default(0.05),   // Integral gain
  kd: joi.number().default(0.1),    // Derivative gain
  dt: joi.number().default(5000),   // Time interval in milliseconds,
  initial: joi.number().default(0), // Initial value
  target:  joi.number().default(100),  // Target value
  u_bound: joi.number().default(100),  // max output value
  l_bound: joi.number().default(0),    // min output value
  reverse: joi.number().default(true), // reverse mode
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
