module.exports = function (homebridge) {
    let Valve = require("./valve.js");
    let PersistenceValve = require("./persistence.js");
    homebridge.registerAccessory(
        "homebridge-gpio-valve",
        "GPIO-Valve-Service",
        Valve(homebridge, PersistenceValve),
        true);
}