#! /usr/bin/env node

var csv = require('csv');
var fs = require('fs');

var parser = csv.parse({
    delimiter: ';'
    , columns: true
    , auto_parse: true
    , escape: '\\'
    , quote: ''
});
var stringfier = csv.stringify();

var readStream = fs.createReadStream('registers.csv',{ encoding : 'utf-8'}).pipe(parser);

var parsed = {};

function extract (obj) {

    var prod = {
         nome: data['PRODUTO_DESCRICAO']
         , unidade: data['TIPO_UNIDADE_MEDIDA_PRODUTO_DESCRICAO']
         , unidade_sigla: data['TIPO_UNIDADE_MEDIDA_PRODUTO_SIGLA']
    };
    prod.nome = prod.nome.replace(/"/g, '\\"');
    prod.unidade = (prod.unidade === 'KILOGRAMA') ? 'GRAMA' : prod.unidade;
    prod.unidade_sigla = (prod.unidade_sigla === 'KG') ? 'GR' : prod.unidade_sigla;

    return prod;
}

parser.on('readable', function() {
    var prod, aux;
    while(data = parser.read()) {
        prod = parsed[data['PRODUTO_DESCRICAO']];
        if( prod == undefined) {
            prod = extract(data);
            console.log('INSERT INTO produto (nome, unidade, unidade_sigla)' +
            ' VALUES ("' + prod.nome + '", "' + prod.unidade + '", "' + prod.unidade_sigla + '");');
            parsed[prod.nome] = prod;
        }
        else {
           aux = extract(data);
            if(prod.unidade !== aux.unidade) {
                console.log('FUCK1 ' + prod.nome + ' ' + prod.unidade + ' ' + aux.unidade);
            }
            if(prod.unidade_sigla !== aux.unidade_sigla) {
                console.log('FUCK2 ' + prod.nome + ' ' + prod.unidade_sigla + ' ' + aux.unidade_sigla);
            }
        }
    }
});

parser.on('error', function(error){
    console.log(error);
});

parser.on('finish', function (){
    // console.log(parsed);
});

/*stringfier.on('readable', function() {
    while(data = stringfier.read()) {
        console.log(data);
    }
});*/
