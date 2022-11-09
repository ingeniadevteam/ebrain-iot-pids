# PID

https://www.npmjs.com/package/awesome-pid

## Config

config/pid.json
```json
[
  {
    "name": "PID1", // PID name
    "k_p": 0.5,     // Proportional gain
    "k_i": 0.05,    // Integral gain
    "k_d": 0.1,     // Derivative gain
    "dt": 1000,     // Time interval in milliseconds
  }
]
```

## Example

```js
app.pids.PID1.setTarget(32); // 32ºC
let goalReached = false
while (!goalReached) {
  let output = measureFromSomeSensor();
  let input  = ctr.update(output);
  applyInputToActuator(input);
  goalReached = (input === 0) ? true : false; // in the case of continuous control, you let this variable 'false'
}

```
