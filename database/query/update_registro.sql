UPDATE
    registro
SET
    id_produto = $1
    , id_local = $2
    , preco = $3
    , data = $4
    , quantidade_por_unidade = $5
WHERE
    (id_produto = $1) AND
    (id_local = $2);
