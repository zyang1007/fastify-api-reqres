const input = {
    "eth": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "0x1cf4e5001ab8d369d2d76b87658ee719f85e2d6e"]],
    "ethTokens": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "0x1cf4e5001ab8d369d2d76b87658ee719f85e2d6e", "DAI"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "0x1cf4e5001ab8d369d2d76b87658ee719f85e2d6e", "USDT"]],
    "bch": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y",
        "tpubD6NzVbkrYhZ4XQucnzr7LNP8MrMjASTn7h1Xz9Eqj8rnq3bxL31qZF1t9k9vJ4GQJKQA63b1RZQixmwxhaX74xzWR4Hm9t8mBAoquxrNLQh"]],
    "eos": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "proxyrozy123"]],
    "eosTokens": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "eedae1dair5w", "IQ"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "eedae1dair5w", "TLOS"]],
    "trx": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c"]],
    "trxTokens": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "TWJ"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "BTT"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "ANTE"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "TWM"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "USDT"],
        ["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "419ad6fcdd3b423843d1b7077e3f08e50f02fa911c", "WIN"]],
    "xmr": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y", "xxx",
        "544abeb63b8e250a43903a6520ef1f54888655b1ae7d87d0a76f09404f61730c"]],
    "btc": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y",
        "tpubD8szuhbEMy3YsXcfREnurMrKu8b5mNS6iXkoPoPj3pdkHEX9wjgNAs4zgG56tEYiNQUjCQ9L4UUxsniaSvQyDVfzG86n8mAmNcyE7ppPzCL"]],
    "ltc": [["HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y",
        "tpubD98231kvgEd78q3yYBCLGZj9zpK3mqAb7dzJBt7Zki8Z1EgAv3Jw3k3Eqp2iiYzqwvUD9jciD9L321ziDUqoJQ2o5uUvhWuegQ5MEvBcM3M"]]
};

// transform the input data
const transformData = (data) => {
    const result = {};

    // define transformation rules for each type
    const transformations = {
        btc: ["store", "xpub"],
        ltc: ["store", "xpub"],
        eth: ["store", "address"],
        ethTokens: ["store", "address", "name"],
        bch: ["store", "xpub"],
        eos: ["store", "address"],
        eosTokens: ["store", "address", "name"],
        trx: ["store", "address"],
        trxTokens: ["store", "address", "name"],
        xmr: ["store", "address", "viewkey"]
    };

    for (const [key, value] of Object.entries(data)) {
        result[key] = value.map(item => {
            const [store, ...rest] = item;
            const transformedItem = { store };
            transformations[key].slice(1).forEach((field, index) => {
                transformedItem[field] = rest[index];
            });
            return transformedItem;
        });
    }

    return result;
};

const transformedData = transformData(input);
console.log(JSON.stringify(transformedData, null, 2));
