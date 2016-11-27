#! /usr/bin/env node

var csv = require('csv');
var fs = require('fs');

var parser = csv.parse({
    delimiter: ';'
    , columns: ['code', 'name' , 'category' , 'type', 'unity']
    , auto_parse: true
    , escape: '\\'
    , quote: ''
});
var stringfier = csv.stringify();

var readStream = fs.createReadStream('products.csv',{ encoding : 'utf-8'}).pipe(parser);

var parsed = {};

parser.on('readable', function() {
    while(data = parser.read()) {
        parsed[data.code] = data.name;
    }
});

parser.on('error', function(error){
    console.log(error);
});

parser.on('finish', function (){
    console.log(parsed);
});

/*stringfier.on('readable', function() {
    while(data = stringfier.read()) {
        console.log(data);
    }
});*/
