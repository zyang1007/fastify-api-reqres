// give Arrays
const xpubArray = [
    "tpubD8szuhbEMy3YsXcfREnurMrKu8b5mNS6iXkoPoPj3pdkHEX9wjgNAs4zgG56tEYiNQUjCQ9L4UUxsniaSvQyDVfzG86n8mAmNcyE7ppPzCL",
    "tpubD8szuhbEMy3YsXcfREnurMrKu8b5mNS6iXkoPoPj3pdkHEX9wjgNAs4zgG56tEYiNQUjCQ9L4UUxsniaSvQyDVfzG86n8mAmNcyE7ppPzCL-[legacy]"
];
const storeArray = [
    "HnKZ7xcEMBq9n1iNiLKz8soLwGezS3r7ErgbAbAGSZ9y",
    "Ars6dcaC2sKSQL7dJ88JHDx8ewS1DdDh5VuXotWypqVu"
];

// combine the arrays
const combinedResult = {
    btc: storeArray.map((store, index) => ({
        store: store,
        xpub: xpubArray[index]
    }))
};

// output the result
console.log(JSON.stringify(combinedResult, null, 2));
