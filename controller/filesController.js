const readXlsxFile = require('read-excel-file/node')


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
            const rows = await readXlsxFile(req.file.path);
            let userEmail = req.header('userEmail')
            rows.shift();
            rows.forEach(async (row) => {
            })

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



