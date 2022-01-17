const settings = require('../settings')

//Used for logging steps to the console if VERBOSE is enabled in the settings.
const log = (message)=>{
    if(settings.VERBOSE==true){console.log(message)}
}

module.exports={log}