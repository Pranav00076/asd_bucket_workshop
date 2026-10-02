const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../database/db.json");

let cache = {};
let data = [];


// Read database
async function getData() {
    try {
        const dataAw = await fs.readFile(filePath, "utf-8");
        return dataAw;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


// Delay
async function delayRead() {
    return new Promise((res, rej) => {
        setTimeout(res, 1500);
    });
}


// Load cache
async function loadCache() {
    try {
        await delayRead();

        const data1 = await getData();

        data = JSON.parse(data1);

        cache = {};

        for (let obj of data) {
            cache[obj.id] = obj;
        }

        return {
            cache,
            data
        };

    } catch (err) {
        console.log(err);
        throw err;
    }
}


// POST
async function postProduct(req) {
    try {
        const { name, price } = req.body;

        let toWrite = await getData();

        toWrite = JSON.parse(toWrite);

        const newObj = {
            id: toWrite.length + 1,
            name: name,
            price: price
        };

        toWrite.push(newObj);

        await fs.writeFile(
            filePath,
            JSON.stringify(toWrite, null, 2)
        );

        // Update cache
        cache[newObj.id] = newObj;
        data = toWrite;

        return newObj;

    } catch (err) {
        console.log(err);
        throw err;
    }
}


// PUT
async function putProduct(id, body) {
    try {
        let toWrite = await getData();

        toWrite = JSON.parse(toWrite);

        const index = toWrite.findIndex(product => product.id === id);

        if (index === -1) {
            return null;
        }

        // PUT replaces the entire resource
        const updatedProduct = {
            id: id,
            name: body.name,
            price: body.price
        };

        toWrite[index] = updatedProduct;

        await fs.writeFile(
            filePath,
            JSON.stringify(toWrite, null, 2)
        );

        // Update cache
        cache[id] = updatedProduct;
        data = toWrite;

        return updatedProduct;

    } catch (err) {
        console.log(err);
        throw err;
    }
}


// PATCH
async function patchProduct(id, body) {
    try {
        let toWrite = await getData();

        toWrite = JSON.parse(toWrite);

        const index = toWrite.findIndex(product => product.id === id);

        if (index === -1) {
            return null;
        }

        // PATCH only changes provided fields
        if (body.name !== undefined) {
            toWrite[index].name = body.name;
        }

        if (body.price !== undefined) {
            toWrite[index].price = body.price;
        }

        await fs.writeFile(
            filePath,
            JSON.stringify(toWrite, null, 2)
        );

        // Update cache
        cache[id] = toWrite[index];
        data = toWrite;

        return toWrite[index];

    } catch (err) {
        console.log(err);
        throw err;
    }
}


// DELETE
async function deleteProduct(id) {
    try {
        let toWrite = await getData();

        toWrite = JSON.parse(toWrite);

        const index = toWrite.findIndex(product => product.id === id);

        if (index === -1) {
            return null;
        }

        const deletedProduct = toWrite[index];

        toWrite.splice(index, 1);

        await fs.writeFile(
            filePath,
            JSON.stringify(toWrite, null, 2)
        );

        // Update cache
        delete cache[id];
        data = toWrite;

        return deletedProduct;

    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    getData,
    delayRead,
    loadCache,
    cache,
    postProduct,
    putProduct,
    patchProduct,
    deleteProduct
};