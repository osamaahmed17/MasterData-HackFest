const validations = require('../validator/validations')
const schema = require('../validator/schema')
const orderModel = require('../model/orderModel')
const OrderService = require('./service/orderService');
const config = require('../config/config.js')








const orderService = new OrderService(
    orderModel.getInstance()
);


class orderController {
    constructor() {

        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.response = {
            success: true,
            responseCode: "T01",
            message_en: "The transaction was completed successfully.",
            message_ur: "The transaction was completed successfully.",
            data: []
        };

    };

    async getAll(req, res) {
        let userEmail = req.header('userEmail')
      
     
            const service = orderService
            const getData = await service.getAll({ userEmail: userEmail });
            this.response.data = getData.data;
            if (getData.error) return res.status(getData.statusCode).send(getData);
            return res.status(200).send(this.response);
        


    }

    async insert(req, res) {
        let userEmail = req.header('userEmail')
        let storeName = req.header('storeName')
        const requestValidation = validations.verifySchema(
            schema[config.schema[this.constructor.name]],
            req.body
        );
        if (!requestValidation.success) {
            return res.status(400).send(requestValidation);
        }
       
        
    }

    async update(req, res) {
        let userEmail = req.header('userEmail')
        const requestValidation = validations.verifySchema(
            schema[config.schema[this.constructor.name]],
            req.body
        );
        if (!requestValidation.success) {
            return res.status(400).send(requestValidation);
        }
        const {
            id
        } = req.params;
     

   
            const service = orderService
            let updateData = await service.update(id, req.body);
            this.response.data = updateData;
            if (updateData.error) return res.status(updateData.statusCode).send(updateData);
            return res.status(202).send(this.response);
        
    }

    async delete(req, res) {
        const {
            id
        } = req.params;
       
     
            const service = orderService
            let deleteData = await service.delete(id);
            this.response.data = deleteData;
            if (deleteData.error) return res.status(deleteData.statusCode).send(deleteData);
            return res.status(202).send(this.response);
        
    }


}

module.exports = new orderController;





