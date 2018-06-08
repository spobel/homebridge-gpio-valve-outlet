let Accessory, Service, Characteristic, UUIDGen;
let Persistence, Identifier;

const Gpio = require("onoff").Gpio;

module.exports = function (homebridge, persistence, identifier) {
    Accessory = homebridge.platformAccessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    Identifier = identifier;

    return Switch;
};

function Switch(log, config) {
    this.log = log;
    this.config = config;
    this.version = require("./package.json").version;

    this.loadConfiguration();

    this.initGPIO();

    this.initService();
}

Switch.prototype.getServices = function () {
    return [this.informationService, this.service];
};

Switch.prototype.loadConfiguration = function () {
    this.name = this.config.name;
    this.pin = this.config.pin;
    this.log("GPIO" + this.pin);
    this.invertHighLow = this.config.invertHighLow || false;
};

Switch.prototype.initService = function () {
    this.informationService = new Service.AccessoryInformation();
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, "Sebastian Pobel")
        .setCharacteristic(Characteristic.Model, Identifier)
        .setCharacteristic(Characteristic.SerialNumber, "GPIO" + this.pin)
        .setCharacteristic(Characteristic.FirmwareRevision, this.version);

    this.service = new Service.Switch(this.name);
    this.service.isPrimaryService = true;

    this.hap = {};
    this.hap.characteristicOn = this.service.getCharacteristic(Characteristic.On);
    this.hap.characteristicOn.updateValue(false);
    this.hap.characteristicOn.on('change', this.changeCharacteristicOn.bind(this));

    this.log(Identifier + " service initialized.");
};

Switch.prototype.changeCharacteristicOn = function () {
    if (this.hap.characteristicOn.value) {
        this.switchOn();
    } else {
        this.switchOff();
    }
};

Switch.prototype.switchOn = function () {
    this.log("switching on...");
    this.gpioSwitch.writeSync(((!this.invertHighLow)? Gpio.HIGH : Gpio.LOW));
    this.log("switched on");
};

Switch.prototype.switchOff = function () {
    this.log("switching off...");
    this.gpioSwitch.writeSync(((!this.invertHighLow)? Gpio.LOW : Gpio.HIGH));
    this.log("switched off");
};

Switch.prototype.initGPIO = function () {
    this.gpioSwitch = new Gpio(this.pin, 'out');
    this.gpioSwitch.writeSync(((!this.invertHighLow)? Gpio.LOW : Gpio.HIGH));
};