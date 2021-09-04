module.exports=
    {
        "NODE_ENV":"test",
        "dbTest":"mongodb://osamaahmed17:Airuniversity17@glocallytest-shard-00-00.5vrjj.mongodb.net:27017,glocallytest-shard-00-01.5vrjj.mongodb.net:27017,glocallytest-shard-00-02.5vrjj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-41pxah-shard-0&authSource=admin&retryWrites=true&w=majority",
        "dbProduction":"mongodb://osamaahmed17:Airuniversity17@glocally-shard-00-00.wsvsz.mongodb.net:27017,glocally-shard-00-01.wsvsz.mongodb.net:27017,glocally-shard-00-02.wsvsz.mongodb.net:27017/masterdata?ssl=true&replicaSet=atlas-6e5e3z-shard-0&authSource=admin&retryWrites=true&w=majority",
            "winston": {
                "file": {
                    "level": "info",
                    "filename": "./app.log",
                    "handleExceptions": "true",
                    "json": true,
                    "maxsize": 5242880,
                    "maxFiles": 5,
                    "colorize": "false"
                },
                "console": {
                    "level": "debug",
                    "handleExceptions": true,
                    "json": false,
                    "colorize": true
                }
            },
            "cache": {
                "server": "datagrid",
                "port": 11222,
                "cacheName": "jazzcash",
                "responseCodeCache": "ResponseCodeCache",
                "url": "http://datagrid:11222/rest/v2/caches/"
            },
            "cache_New": {
                "server": "datagrid",
                "port": 11222,
                "cacheName": "jazzcash",
                "responseCodeCache": "ResponseCodeCache_New"
            },
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