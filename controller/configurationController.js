const  controller = require('./controller')
const configurationModel = require('../model/configurationModel')
const configurationService = require('./service/configurationService');


const configurationServiceObj = new configurationService.configurationService(
      new configurationModel().getInstance()
);

class configurationController extends controller {

    constructor(service) {
        super(service);
    }

}

module.exports= new configurationController(configurationServiceObj);
