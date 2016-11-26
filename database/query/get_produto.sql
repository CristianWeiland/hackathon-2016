SELECT
    r.preco
    , r.data
    , l.nome
    , l.bairro
    , l.logradouro
    , l.numero
    , l.complemento
    , l.cep
    , l.latitude
    , l.longitude
FROM
    produto p
INNER JOIN registros r ON p.id = r.id_produto
INNER JOIN local l ON r.id_local = l.id
WHERE
    name = $1
ORDER BY
    r.preco DESC;
