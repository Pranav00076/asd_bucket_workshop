const express = require('express')
const productsRouter = require("./routers/products")

const app = express()
const PORT = 8080;

app.use('/products', productsRouter)

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})

