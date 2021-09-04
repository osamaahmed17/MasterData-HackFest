const validations = require('../validator/validations')
const schema = require('../validator/schema')
const orderModel = require('../model/orderModel')
const OrderService = require('./service/orderService');
const config = require('../config/config.js')
const Onfleet = require("@onfleet/node-onfleet")
var Airtable = require('airtable');


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyUyYsXPwkiSpjDd'
});

var base = new Airtable({ apiKey: 'keyUyYsXPwkiSpjDd' }).base('app1zZgrrJBwRx3W4');





const onfleet = new Onfleet("0c631b60b4d4ae575174a0de39b8cf3d");
onfleet.verifyKey();



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
        let orderArray = []
        if (req.header("database") == "Airtable") {
            base('Order').select({
                filterByFormula: "({shopper_email} = '" + userEmail + "')"
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    let status
                    let size

                    if (record.fields.parcel_size != undefined || record.fields.parcel_weight != undefined) {
                        if (record.fields.parcel_size != undefined) {
                            if (record.fields.parcel_size <= 2) {
                                size = "small"
                            }
                            if (record.fields.parcel_size > 2 && record.fields.parcel_size <= 3) {
                                size = "medium"
                            }
                            if (record.fields.parcel_size > 3) {
                                size = "large"
                            }
                        }
                        if (record.fields.parcel_weight != undefined) {
                            if (record.fields.parcel_weight <= 0.5) {
                                size = "small"
                            }
                            if (record.fields.parcel_weight > 0.5 && record.fields.parcel_size <= 1) {
                                size = "medium"
                            }
                            if (record.fields.parcel_weight > 1) {
                                size = "large"
                            }
                        }
                    }
                    else {
                        size = "Not Mentioned"
                    }
                    switch (record.fields.parcel_status) {
                        case "01_New":
                            status = "New"
                            break;
                        case "03a_Delivered":
                            status = "Delivered"
                            break;
                        case "02_In Transit":
                            status = "Transit"
                            break;
                        case "03c_Failed":
                            status = "Failed"
                            break;
                        case "03a_MAIL: Delivery Successful":
                            status = "Delivery Mail Successful"
                            break;

                        case "03b_MAIL: Delivery Successful (Neighbour)":
                            status = "Delivery Mail Successful (Neighbour)"
                            break;

                        case "03b_Delivered (Neighbour)":
                            status = "Delivery Successful (Neighbour)"
                            break;
                        case "03c_MAIL: Delivery Failed":
                            status = "Delivery Mail Unsuccessful"
                            break;
                        default:
                            status = "Pending"
                    }
                    let order = {
                        additionalComment: record.fields.shopper_additional_address,
                        city: record.fields.shopper_city,
                        name: record.fields.shopper_name,
                        orderId:record.fields.parcel_id,
                        parcelSize: size,
                        phoneNumber: record.fields.retailer_phone[0],
                        pickupLocation: record.fields.retailer_street[0],
                        postalCode: (record.fields.shopper_zip).toString(),
                        shoppersEmail: record.fields.shopper_email,
                        streetAddress: record.fields.shopper_street,
                        userEmail: userEmail,
                        storeName: record.fields.retail_id,
                        deliveryDate: record.fields.parcel_status_last_modified,
                        status: status,
                        id: record.id
                        
                    }
                    orderArray.push(order)
                });
                fetchNextPage();
            }, function done(err) {
                if (err) { console.error(err); return; }
                let response = {
                    success: true,
                    responseCode: "T01",
                    message_en: "The transaction was completed successfully.",
                    message_ur: "The transaction was completed successfully.",
                    data: []
                };
                response.data = orderArray
                return res.status(200).send(response);
            });
        }
        else {
            const service = orderService
            const getData = await service.getAll({ userEmail: userEmail });
            this.response.data = getData.data;
            if (getData.error) return res.status(getData.statusCode).send(getData);
            return res.status(200).send(this.response);
        }


    }

    async insert(req, res) {
        let userEmail = req.header('userEmail')
        let storeName = req.header('storeName')
        let status = "01_New";
        const requestValidation = validations.verifySchema(
            schema[config.schema[this.constructor.name]],
            req.body
        );
        if (!requestValidation.success) {
            return res.status(400).send(requestValidation);
        }
        let parcel_size
        let parcel_weight
        let orderId= Math.floor(Math.random() * 10000000000000);
        switch (req.body.parcelSize) {
            case "small":
                parcel_size = "2"
                parcel_weight = 0.5
                break;
            case "medium":
                parcel_size = "3"
                parcel_weight = 1.0
                break;
            case "large":
                parcel_size = "4"
                parcel_weight = 2.0
                break;
            default:
                parcel_size = "1"
                parcel_weight = 0.5
        }
        if (req.header("database") == "Airtable") {
            base('Retailer').select({
                filterByFormula: "({retail_id} = '" + storeName + "')"
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    base('Order').create([
                        {
                            "fields": {
                                "parcel_id":(orderId).toString(),
                                "shopper_name": req.body.name,
                                "shopper_zip": parseInt(req.body.postalCode),
                                "shopper_street": req.body.streetAddress,
                                "shopper_city": req.body.city,
                                "shopper_email": userEmail,
                                "retail_id": storeName,
                                "shopper_phone":req.body.phoneNumber,
                                "parcel_size": parcel_size,
                                "parcel_weight": parcel_weight,
                                "parcel_delivery_method": "Local Delivery",
                                "parcel_article_quantity": 1,
                                "parcel_status": status,
                                "retailer_id": [record.id]

                            }
                        }
                    ]);
                })
                fetchNextPage();
            }, function done(err) {
                if (err) { console.error(err); return; }
                let response = {
                    success: true,
                    responseCode: "T01",
                    message_en: "The transaction was completed successfully.",
                    message_ur: "The transaction was completed successfully.",
                    data: []
                };
                response.data = req.body
                return res.status(200).send(response);
            })
        }
    }

    async update(req, res) {
        let userEmail = req.header('userEmail')
        let storeName = req.header('storeName')
        let status = "01_New";
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
        if (req.header("database") == "Airtable") {
            let parcel_size
            let parcel_weight
            switch (req.body.parcelSize) {

                case "small":
                    parcel_size = "2"
                    parcel_weight = 0.5
                    break;
                case "medium":
                    parcel_size = "3"
                    parcel_weight = 1.0
                    break;
                case "large":
                    parcel_size = "4"
                    parcel_weight = 2.0
                    break;
                default:
                    parcel_size = "1"
                    parcel_weight = 0.5
            }
            base('Retailer').select({
                filterByFormula: "({retail_id} = '" + storeName + "')"
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    req.body.retailer_link = [record.id]
                    base('Order').replace([
                        {
                            "id": id,
                            "fields": {
                                "parcel_id":(orderId).toString(),
                                "shopper_name": req.body.name,
                                "shopper_zip": parseInt(req.body.postalCode),
                                "shopper_street": req.body.streetAddress,
                                "shopper_city": req.body.city,
                                "shopper_email": userEmail,
                                "retail_id": storeName,
                                "shopper_phone":req.body.phoneNumber,
                                "parcel_size": parcel_size,
                                "parcel_weight": parcel_weight,
                                "parcel_delivery_method": "Local Delivery",
                                "parcel_article_quantity": 1,
                                "parcel_status": status,
                                "retailer_id": [record.id]

                            }

                        }
                    ], function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                })
                fetchNextPage();
            }, function done(err) {
                if (err) { console.error(err); return; }
                let response = {
                    success: true,
                    responseCode: "T01",
                    message_en: "The transaction was completed successfully.",
                    message_ur: "The transaction was completed successfully.",
                    data: []
                };
                response.data = req.body
                return res.status(200).send(response);
            })
        }

        else {
            const service = orderService
            let updateData = await service.update(id, req.body);
            this.response.data = updateData;
            if (updateData.error) return res.status(updateData.statusCode).send(updateData);
            return res.status(202).send(this.response);
        }
    }

    async delete(req, res) {
        const {
            id
        } = req.params;
        if (req.header("database") == "Airtable") {
            base('Order').destroy([id
            ], function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                if (err) { console.error(err); return; }
                return res.status(200).send("Record has been deleted");
            })
        }
        else {
            const service = orderService
            let deleteData = await service.delete(id);
            this.response.data = deleteData;
            if (deleteData.error) return res.status(deleteData.statusCode).send(deleteData);
            return res.status(202).send(this.response);
        }
    }


}

module.exports = new orderController;





