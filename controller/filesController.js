const readXlsxFile = require('read-excel-file/node')
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
var Airtable = require('airtable');

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyUyYsXPwkiSpjDd'
});
var base = new Airtable({ apiKey: 'keyUyYsXPwkiSpjDd' }).base('app1zZgrrJBwRx3W4');


class filesController {
    constructor() {
        this.upload = this.upload.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.response = {
            success: true,
            responseCode: "T01",
            message_en: "The transaction was completed successfully.",
            message_ur: "The transaction was completed successfully.",
            data: []
        };
    }

    async upload(req, res) {
        try {
            if (req.header("dataBase") == "Airtabe") {
                const rows = await readXlsxFile(req.file.path);
                let userEmail = req.header('userEmail')
                let storeName = req.header('storeName')
                let status = "01_New";
                let size_in_cm
                let weight_in_kg
                let orderId = Math.floor(Math.random() * 10000000000000);
                rows.shift();
                rows.forEach(async (row) => {
                    switch (row[1]) {
                        case "small":
                            size_in_cm = "2"
                            weight_in_kg = 0.5
                            break;
                        case "medium":
                            size_in_cm = "3"
                            weight_in_kg = 1.0
                            break;
                        case "large":
                            size_in_cm = "4"
                            weight_in_kg = 2.0
                            break;
                        default:
                            size_in_cm = "1"
                            weight_in_kg = 0.5
                    }
                    base('Retailer').select({
                        filterByFormula: "({retail_ID} = '" + storeName + "')"
                    }).eachPage(function page(records, fetchNextPage) {
                        records.forEach(function (record) {
                            base('Order').create([
                                {
                                    "fields": {
                                        "order_ID": (orderId).toString(),
                                        "name": row[0],
                                        "zip_code": parseInt(row[4]),
                                        "street_number": row[2],
                                        "city": row[5],
                                        "email": userEmail,
                                        "owner_retail": storeName,
                                        "size_in_cm": size_in_cm,
                                        "weight_in_kg": weight_in_kg,
                                        "delivery_method": "Local Delivery",
                                        "articles": 1,
                                        "status": status,
                                        "retailer_link": [record.id]

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
                )
            }
            res.status(200).send("Data has been updated")
        } catch (error) {
            res.status(400).send(error.message);
        }
    }


    async uploadImage(req, res) {


        const handler = tfn.io.fileSystem("model.json");
        const model = await tf.loadLayersModel(handler);
    }
}

module.exports = new filesController;



