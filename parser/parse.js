#! /usr/bin/env node

var csv = require('csv');
var fs = require('fs');
var pg = require('pg');

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

 /* Conexão com o DB */
var client = new pg.Client('postgres://hackathon:123mudar@localhost:5432/hackathon');
var products = {};
var locais = {};
var parsed = {};
client.connect(function (err) {
    if (err) throw err;

    // Execute a query on our database
    client.query('SELECT id, nome from produto;',[] , function (err, result) {
        if (err) throw err;

        result.rows.forEach(function(item){
            products[item.nome] = item.id;
        });

        client.query('SELECT id, nome from local;', [], function (err, result) {
            if (err) throw err;

            // Disconnect the client
            client.end(function (err) {
                if (err) throw err;
            });

            result.rows.forEach(function(item){
                locais[item.nome] = item.id;
            });

            var readStream = fs.createReadStream('registers.csv',{ encoding : 'utf-8'}).pipe(parser);
        });
    });
});




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
     local : obj['ENDERECO_ESTABELECIMENTO']
     , data : obj['DATA_PESQUISA']
     , preco : obj['PRECO_PESQUISADO']
     , produto : obj['PRODUTO_DESCRICAO']
    };
    prod.id_produto = products[prod.produto];
    prod.id_local = products[prod.local];

    return prod;

}

parser.on('readable', function() {
    var prod, aux;
    while(data = parser.read()) {
        prod = parsed[data['ENDERECO_ESTABELECIMENTO'] + ' ' + data['PRODUTO_DESCRICAO']];
        if( prod == undefined) {
            prod = extract(data);
            //console.log('INSERT INTO produto (nome, unidade, unidade_sigla)' +
            //' VALUES ("' + prod.nome + '", "' + prod.unidade + '", "' + prod.unidade_sigla + '");');
            parsed[prod.local + ' ' + prod.produto] = prod;
        }
        else {
           aux = extract(data);
           var split1 = prod.data.split('/');
           var split2 = aux.data.split('/');
           var date1 = new Date(split1[2], split1[1], split1[0]);
           var date2 = new Date(split2[2], split2[1], split2[0]);
            if(date1.valueOf() < date2.valueOf()) {
               parsed[data['ENDERECO_ESTABELECIMENTO'] + ' ' + data['PRODUTO_DESCRICAO']] = aux;
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
        var params = [item.id_produto, item.id_local, item.preco, item.data];
        var str = ('INSERT INTO registro (id_produto, id_local, preco, data' +
        ') VALUES (\'' +
          params.join('\', \'') + '\');');
        console.log(str);
    });
});

/*stringfier.on('readable', function() {
    while(data = stringfier.read()) {
        console.log(data);
    }
});*/
