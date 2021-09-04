const config = require('../../config/config')

class Service {
    constructor(model) {
        this.model = model;
        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async getAll(query) {
        let {
            skip,
            limit
        } = query;
        delete query.skip;
        delete query.limit;
        
        try {
            let items;
            items = await this.model
            .find(query)
            .skip(skip)
            .limit(limit);
            let total = await this.model.count();
            return {
                error: false,
                statusCode: 200,
                data: items,
                total
            };
        } catch (error) {
            console.log(`src.services.service.getAll()`)
            console.log(error.stack)
            console.log(error.message)
            return {
                error: true,
                statusCode: 500,
                errors: error
            };
        }
    }

    async insert(data) {
        console.log(this.model.collection.name)

        try {
            if (config.mongoModel[this.model.collection.name].hasLocation) {
                let location = {
                    location: {
                        type: "Point",
                        coordinates: [data.long, data.lat]
                    }
                };
                Object.assign(data, location);
                delete data.long;
                delete data.lat;

            }
            console.log(data)
            let item = await this.model.create(data);
            if (item)
                return {
                    error: false,
                    item
                };
        } catch (error) {
           console.log("error", error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || "Not able to create item",
                errors: error.errors
            };
        }
    }

    async update(id, data) {
        try {
          
            let item = await this.model.findByIdAndUpdate(id, data, {
                new: true
            });
            return {
                error: false,
                statusCode: 202,
                item
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error
            };
        }
    }

    async delete(id) {
        try {
            let item = await this.model.findByIdAndDelete(id);
            if (!item)
                return {
                    error: true,
                    statusCode: 404,
                    message: "item not found"
                };

            return {
                error: false,
                deleted: true,
                statusCode: 202,
                item
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error
            };
        }
    }
}

module.exports= Service;