const express = require("express");
const {
    postProduct,
    loadCache,
    putProduct,
    patchProduct,
    deleteProduct
} = require("../controller/controller");

const router = express.Router();

let cache = {};
let loaded = {};


// GET all products
router.get("/", async (req, res) => {
    try {
        if (!cache["1"]) {
            loaded = await loadCache();
            cache = loaded.cache;
            res.json(loaded.data);
            return;
        }

        res.json(loaded.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET cache
router.get("/cache", (req, res) => {
    res.json(cache);
});


// GET product by ID
router.get("/:id", async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        if (cache[itemId]) {
            res.json(cache[itemId]);
            return;
        }

        loaded = await loadCache();
        cache = loaded.cache;

        if (!cache[itemId]) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(cache[itemId]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// POST product
router.post("/", async (req, res) => {
    try {
        const product = await postProduct(req);

        res.status(201).json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// PUT product
router.put("/:id", async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        const product = await putProduct(itemId, req.body);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// PATCH product
router.patch("/:id", async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        const product = await patchProduct(itemId, req.body);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// DELETE product
router.delete("/:id", async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        const product = await deleteProduct(itemId);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


module.exports = router;