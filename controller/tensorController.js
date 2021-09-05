
const tf = require('@tensorflow/tfjs')
const mobilenet = require('@tensorflow-models/mobilenet');
global.fetch = require('node-fetch')
const jpeg = require('jpeg-js');
const fs = require('fs');
// const toxicity = require('@tensorflow-models/toxicity');



const NUMBER_OF_CHANNELS = 3

function readImage( path){
  const buf = fs.readFileSync(path)
  const pixels = jpeg.decode(buf, true)
  return pixels
}

function imageByteArray (image, numChannels) {
  const pixels = image.data
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);
  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }
  return values
}

function imageToInput(image, numChannels){
  const values = imageByteArray(image, numChannels)
  const outShape = [image.height, image.width, numChannels];
  const input = tf.tensor3d(values, outShape, 'int32');
  return input
}


async function classify(path){
    const image = readImage(path)
    const input = imageToInput(image, NUMBER_OF_CHANNELS)
    const mobilenetModel = await mobilenet.load();
    const predictions = await mobilenetModel.classify(input)
    return predictions
}



class filesController {
    constructor() {
        this.upload = this.upload.bind(this);

        this.response = {
            success: true,
            responseCode: "T01",
            message_en: "The transaction was completed successfully.",
            message_ur: "The transaction was completed successfully.",
            data: []
        };
    }

    async upload(req, res) {

        const result = await classify(req.file.path)
        this.response.data = result;
        return res.status(200).send(this.response);
    }






    // async upload(req, res) {
    //     try {

    //         const threshold = 0.9;

    //         // Which toxicity labels to return.
    //         const labelsToInclude = ['identity_attack', 'insult', 'threat'];

    //         toxicity.load(threshold, labelsToInclude).then(model => {
    //             // Now you can use the `model` object to label sentences. 
    //             model.classify(['you suck']).then(predictions => {
    //                 console.log(predictions)
    //             });
    //         });
    //     } catch (error) {
    //         res.status(400).send(error.message);
    //     }
    // }



}

module.exports = new filesController;



