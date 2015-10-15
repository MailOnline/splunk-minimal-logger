"use strict";

var net = require('net'),
    uuid = require('node-uuid');


module.exports = function Splunk(config){
    // { host: 'some.host', port: 1234, namespace: 'ns=something' }

    return {
        txid: function(){
            return uuid.v4();
        },
        log: function(obj){
            console.log('-------------------SPLUNK MESSAGE-------------------');
            var msg = (new Date()).toISOString() + ' ' + config.namespace;
            delete obj.contextConfig;
            for(var key in obj){
                if(obj.hasOwnProperty([key])) {
                    var value = obj[key];
                    if(typeof value != 'object' || value === null){
                        value = '' + value;
                        value = value.replace(' ', '_').replace(/\n|\r/g, ' ');
                    }
                    else {
                        try {
                            value = JSON.stringify(value);
                        } catch(e){
                            value = 'some recursive object';
                        }
                    }
                    if(/ /.test(value))
                        value = '"' + value.replace(/"/g, '\\"') + '"';
                    msg += ' ' + key + '=' + value;
                }
            }
            console.log(msg);
            try{
                var client = new net.Socket();
                client.connect(config.port, config.host, function() {
                    client.write(msg);
                    client.destroy();
                });
            } catch(e){
                console.log('error', e);
            }
        }
    };
};
