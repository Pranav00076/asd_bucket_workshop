const express = require('express');
const {getData, delayRead, loadCache} = require("../controller/controller")

const router = express.Router();

let cache = {}
let loaded = {}

router.get('/', async (req,res) => {
    try{
        if (!cache["1"]){
            loaded = await loadCache()
            cache = loaded.cache
            res.json(loaded.data)
            return
        }

        res.json(loaded.data)
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req,res) => {
    try{
        const itemId = Number(req.params.id);

        if (cache[itemId]){
            res.json(cache[itemId])
            return
        }

        loaded = await loadCache()
        cache = loaded.cache

        res.json(cache[itemId])

    } catch (err) {
        console.log(err)
    }
})

module.exports = router;