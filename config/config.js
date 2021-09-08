module.exports=
    {
        "dbProduction":"mongodb://osamaahmed17:osamaahmed17@hackfest-shard-00-00.bhrym.mongodb.net:27017,hackfest-shard-00-01.bhrym.mongodb.net:27017,hackfest-shard-00-02.bhrym.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-574kto-shard-0&authSource=admin&retryWrites=true&w=majority",
    
            "mongoModel": {
                "orders": {
                    "masterDataCache": false,
                    "cacheList": true,
                    "cacheKey": "userList",
                    "cacheName": "ConfigurationCache",
                    "hasLocation": false
                },
                "configurations": {
                    "masterDataCache": false,
                    "cacheList": true,
                    "cacheKey": "userList",
                    "cacheName": "ConfigurationCache",
                    "hasLocation": false
                }
            },
            "mongoModelIds": {
                "banks": "id"
            },
            "schema": {
                "orderController": "ORDER_SCHEMA",
                "configurationController": "CONFIGURATION_SCHEMA"
            },
            "updateSchema": {
                "configurationController": "CONFIGURATION_SCHEMA"
            }
        
    }