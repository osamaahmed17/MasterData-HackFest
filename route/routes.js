const configurationController = require('../controller/configurationController');
const orderController = require('../controller/orderController')
const filesController = require('../controller/filesController')
const upload =require('../middleware/uploadMiddleware')


module.exports =(app) => {

    /* For the order data */
    app.get(`/rest/api/v1/masterdata/order`, orderController.getAll);
    app.post(`/rest/api/v1/masterdata/order`,orderController.insert);
    app.put(`/rest/api/v1/masterdata/order/:id`, orderController.update);
    app.delete(`/rest/api/v1/masterdata/order/:id`,orderController.delete);


    app.post('/rest/api/v1/masterdata/files/upload',upload.single('file'), filesController.upload);


    app.post('/rest/api/v1/masterdata/files/uploadImage',upload.single('file'), filesController.uploadImage);


    /* For the Configuration data */
    app.get(`/rest/api/v1/masterdata/configuration`, configurationController.getAll);
    app.post(`/rest/api/v1/masterdata/configuration`,configurationController.insert);
    app.put(`/rest/api/v1/masterdata/configuration/:id`, configurationController.update);
    app.delete(`/rest/api/v1/masterdata/configuration/:id`,configurationController.delete);

    
};