#! /usr/bin/env node

var csv = require('csv');
var fs = require('fs');

var parser = csv.parser();

var readStream = fs.createReadStream('products.csv');

readStream.on('readble', function() {
    while(data = readStream.read()) {
        console.log(data);
    }
});
