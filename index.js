"use strict";

var uuid = require('node-uuid');


module.exports = function Splunk(config){
    // config -> { namespace: 'ns=something' }

    return {
        txid: function(){
            return uuid.v4();
        },
        log: function(obj){
            console.log('-------------------SPLUNK MESSAGE-------------------');
            var msg = (new Date()).toISOString() + ' ' + config.namespace;
            delete obj.contextConfig;
            obj.timestamp = (new Date()).toISOString();
            for(var key in obj){
                if(obj.hasOwnProperty([key])) {
                    var value = obj[key];
                    if(value === null || value === undefined) continue;
                    if(typeof value != 'object'){
                        value = '' + value;
                        value = value.replace(/\n|\r/g, ' ');
                    }
                    else {
                        try {
                            value = JSON.stringify(value);
                        } catch(e){
                            value = 'some recursive object';
                        }
                    }
                    if(/[ "]/.test(value))
                        value = '"' + value.replace(/"/g, '\\"') + '"';
                    msg += ' ' + key + '=' + value;
                }
            }
            try{
                console.log('METRIC ' + msg);
            } catch(e){
                console.log('error', e);
            }
        }
    };
};
