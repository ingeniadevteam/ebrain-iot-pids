"use strict";

const { readFileSync } = require ( 'fs' );
const PID = require('./lib/pid');
const validate = require('./validation');

module.exports = async (app) => {
    if (!app.pids.module) {
        // init the pid module
        app.pids.module = {};
        try {
            const configFile = readFileSync(`${app.configDir}/pids.json`).toString();
            app.pids.config = await validate(JSON.parse(configFile));
            
            for (const pid of app.pids.config) {
                app.pids.module[pid.name] = new PID(pid);
            }
        } catch (error) {
            app.logger.error(`pid ${error.message}`);
        }
    }
};