const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, "../database/db.json")

let cache = {}

async function getData() {
    try{
        let data = await fs.readFile(filePath, "utf-8")
        return data
    } catch (err) {
        console.log(err)
    }
}

async function delayRead() {
    return new Promise((res, rej) => {setTimeout(res, 1500)})
}

async function loadCache() {
    try{
        await delayRead()
        let data = await getData();
        data = JSON.parse(data)
        for (let obj of data){
            cache[obj.id] = obj
        }
        return {cache, data}
    } catch (err) {
        console.log(err)
    }
}

loadCache()
module.exports = {getData, delayRead, loadCache, cache}