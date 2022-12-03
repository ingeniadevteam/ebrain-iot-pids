/**
 * PID
 * @constructor
 *
 * @param {Object} opts Options: kp, ki, pd, dt, initial, target, u_bound, l_bound, reverse
 */
 var PID = function(opts) {
    if (opts !== undefined) {
      this.setTuning(opts.kp, opts.ki, opts.kd);
      this.setTimeInterval(opts.dt);
      this.setInput(opts.initial);
      this.setTarget(opts.target);
      this.setUBound(opts.u_bound);
      this.setLBound(opts.l_bound);
      this.setReverse(opts.reverse);
    }
  
    this.reset();
  
    // Getters & Setters
    Object.defineProperties(this, Object.assign({}, {
      kp: { get: function() { return this.setkp; }},
      ki: { get: function() { return this.setki; }},
      kd: { get: function() { return this.setkd; }},
    }));
  };
  
  // If either kp, ki, kd < 0, it is defaulted to 0
  PID.prototype.setTuning = function(kp, ki, kd) {
    this.setkp = (kp === undefined || kp < 0) ? 0 : kp;
    this.setki = (ki === undefined || ki < 0) ? 0 : ki;
    this.setkd = (kd === undefined || kd < 0) ? 0 : kd;
  
    var sec = this.dt / 1000;
    this.kp = this.setkp;
    this.ki = this.setki * sec;
    this.kd = this.setkd / sec;
  };
  
  // Set interval in which PID is computed.  Default is 0.5 second.
  PID.prototype.setTimeInterval = function(ms) {
    this.dt = (ms === undefined || ms < 0) ? 500 : ms;
  }
  
  // Set input value
  PID.prototype.setInput = function(input) {
    this.input = input || 0;
  };
  
  // Set target value
  PID.prototype.setTarget = function(target) {
    this.target = target || 0;
  };
  
  // Set upper bound
  PID.prototype.setUBound = function(ubound) {
    this.u_bound = ubound;
  }
  
  // Set lower bound
  PID.prototype.setLBound = function(lbound) {
    this.l_bound = lbound;
  }
  
  // Set lower bound
  PID.prototype.setReverse = function(reverse) {
    this.reverse = reverse;
  }
  
  
  // Reset values
  PID.prototype.reset = function() {
    this.totalError = 0;
    this.lastInput = this.input;
    this.lastTime = currentTime() - this.dt;
  }
  
  // Single instance of computation - based on Arduino PID library.
  PID.prototype.compute = function() {
    var now = currentTime();
    var timeChange = (now - this.lastTime);
  
    if (timeChange >= this.dt) {
      var input = this.input;
      var error = this.target - input;
      this.totalError += (this.ki * error);
      
      if (this.u_bound !== undefined && this.totalError > this.u_bound) {
        this.totalError = this.u_bound;
      }
      else if (this.l_bound !== undefined && this.totalError < this.l_bound) {
        this.totalError = this.l_bound;
      }
  
      var diff = this.input - this.lastInput;
  
      // PID output computation
      var output = this.kp * error + this.totalError - this.kd * diff;
  
      if (this.u_bound !== undefined && output > this.u_bound) {
        output = this.u_bound;
      }
      else if (this.l_bound !== undefined && output < this.l_bound) {
        output = this.l_bound;
      }
  
      this.output = output;
      this.lastInput = input;
      this.lastTime = now;
  
      if (this.reverse) {
        return this.u_bound - this.output + this.l_bound;
      } else {
        return this.output;
      }
    }
  };
  
  function currentTime() {
    var d = new Date();
    return d.getTime();
  }
  
  module.exports = PID;
  