#! /usr/bin/env node

var csv = require('csv');
var fs = require('fs');

var publicConfig = {
  key: 'AIzaSyAU_020_jWnao1rTyQ8jdhL_17kkZblF1Y',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true // use https 
};
var googlemaps = require('googlemaps');

var gmAPI = new googlemaps(publicConfig);

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

    /*var prod = {
         nome: obj['PRODUTO_DESCRICAO']
         , unidade: obj['TIPO_UNIDADE_MEDIDA_PRODUTO_DESCRICAO']
         , unidade_sigla: obj['TIPO_UNIDADE_MEDIDA_PRODUTO_SIGLA']
    };
    prod.nome = prod.nome.replace(/"/g, '\\"');
    prod.unidade = (prod.unidade === 'KILOGRAMA') ? 'GRAMA' : prod.unidade;
    prod.unidade_sigla = (prod.unidade_sigla === 'KG') ? 'GR' : prod.unidade_sigla;

    return prod;*/

    var prod = {
     nome : obj['ESTABELECIMENTO_REDE']
     , bairro : obj['DESCRICAO_BAIRRO']
     , logradouro : obj['ENDERECO_ESTABELECIMENTO']
     , numero : obj['NUMERO_ENDERECO_ESTABELECIMENTO'].toString()
     , complemento : obj['COMPLEMENTO_ENDERECO_ESTABELECIMEN-TO']
     , latitude : 0.0
     , longitude : 0.0
    };

    prod.numero = prod.numero.replace(/\./g, '');

    return prod;

}

parser.on('readable', function() {
    var prod, aux;
    while(data = parser.read()) {
        prod = parsed[data['ENDERECO_ESTABELESCINTO'] + ' ' + data['NUMERO_ENDERECO_ESTABELESCIMENTO']];
        if( prod == undefined) {
            prod = extract(data);
            //console.log('INSERT INTO produto (nome, unidade, unidade_sigla)' +
            //' VALUES ("' + prod.nome + '", "' + prod.unidade + '", "' + prod.unidade_sigla + '");');
            parsed[prod.logradouro + ' ' + prod.numero] = prod;
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

    var array_parsed  = [];
    for(key in parsed) {
        array_parsed.push(parsed[key])
    }

    array_parsed.forEach(function(item){
        var geocodeParams = {
          "address":    item.logradouro + ' '  + item.numero + ' CURITIBA`',
          "components": "components=country:BR",
          "language":   "pt-br",
          "region":     "br"
        };
        gmAPI.geocode(geocodeParams, function(err, result){
              item.latitude = result.results[0].geometry.location.lat;
              item.longitude = result.results[0].geometry.location.lng;

              var params = [item.nome, item.bairro, item.logradouro, item.numero,
                item.complemento, item.latitude, item.longitude];

            var str = ('INSERT INTO local (nome, bairro, logradouro, numero,' +
            ' complemento, latitude, longitude)' + ' VALUES (\'' +
              params.join('\', \'') + '\');');
            console.log(str.replace(/""/g, 'NULL'));
        });
    });
});

/*stringfier.on('readable', function() {
    while(data = stringfier.read()) {
        console.log(data);
    }
});*/
