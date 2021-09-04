import httpContext from 'express-http-context';
import createLogger from 'winston';
import format from 'winston';
import transports from 'winston';
import stringify from 'json-stringify-safe';
const combine = format;
const timestamp= format;
const label = format;
const printf = format;
const PRODUCTION_LOG_LEVEL = process.env.PRODUCTION_LOG_LEVEL || 'debug';
const MASKING_KEYS = process.env.MASKING_KEYS || "password, pin";
// const timezoned = () => {
//     return new Date().toLocaleString('en-US', {
//         timeZone: 'Asia/Karachi'
//     });
// }

const customFormat = printf((info) => {
    const logObj = httpContext.get('logObj') || null;
    info = Object.assign(info, logObj);
    let log;
    if (process.env.NODE_ENV === 'development') {
        log = `[${info.label}] ${info.timestamp} ${stringify(info, null, '...')}`;
    } else {
        //if object contains sensitive property ( i.e. key value matches pin, mpin, password, CVV , credit card etc etc , NADRA, CNIC , Mother's name ), **** 
        log = `${stringify(info)}`;
        log = maskInput(log);
    }
    if (info instanceof Error) {
        log = `[ERROR:] [${info.label}] ${info.timestamp} ${stringify(info.message)} ${stringify(info.stack)} ${stringify(info)}`
    }
    return log;
});

const maskInput = (strLog) => {
    let sensitiveKeys = MASKING_KEYS ? MASKING_KEYS.split(/[\s,]+/) : [];
    for (let key of sensitiveKeys) {
        let keyToFind = `"${key}":`;
        let regex = new RegExp(`${keyToFind}"[^"]+"`, 'gmi');
        strLog = strLog.replace(regex, `${keyToFind}"*****"`);
    }
    return strLog;
}

const logger = createLogger({
    format: combine(
        label({ label: 'Payment&Transaction_MS' }),
        //timestamp({ format: timezoned }),
        timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),

        
        customFormat,
    ),
    transports: [
        // new winston.transports.File(config.winston.file),
        new transports.Console({
            level: PRODUCTION_LOG_LEVEL,
            handleExceptions: true,
        }),
    ],
    exitOnError: false, // do not exit on handled exceptions
});
module.exports=logger;