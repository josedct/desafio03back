const express = require( 'express' )
const ProductManager = require( './assets/ProductManager' )

const app = express()
const productTest = new ProductManager('./assets/products.json')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, () => console.log('Server Up!'))

//app.get('/api/users', (req, res) => res.status(200).send("hola aqui toy"))

app.get('/products', (req, res) => {

    //validar que sean keys validas

    const {limit} = req.query
    console.log(req)
    let numElement = parseInt(limit)
    let data = ""
    
    if (numElement === NaN || numElement < 0){
        data = `Error en el limite de datos ${numElement}`
    }

    if(numElement > 0){

    }

    req.query

    if(!limit){
        data = `consulta sin limite de datos`
    }

    res.status(200).send(data)
})

app.get('/products/:pid', (req, res) => res.status(200).send("hola aqui toy"))

productTest.getProducts()

