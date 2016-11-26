SELECT
    , l.nome
    , l.bairro
    , l.logradouro
    , l.numero
    , l.complemento
    , l.cep
    , l.latitude
    , l.longitude
FROM
    local l
WHERE
    name = $1;
