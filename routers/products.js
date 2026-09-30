const express = require('express');
const {getData, delayRead, loadCache} = require("../controller/controller")

const router = express.Router();

router.use(async (req,res,next) => {
    await delayRead()
    next()
})

let cache = {}

router.get('/', async (req,res) => {
    try{
        const loaded = await loadCache()
        cache = loaded.cache
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

        cache = await loadCache()
    
        res.json(cache[itemId])
        
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;