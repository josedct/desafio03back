const express = require( 'express' )
const ProductManager = require( './assets/ProductManager' )

const app = express()
const productTest = new ProductManager('./assets/products.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, () => console.log('Server Up!'))

app.get('/products', (req, res) => {
    //consultar solo si el limit es valido y el unico parametro en la query
    let arrayQuery = Object.keys(req.query)
    if(arrayQuery.length > 0){
        if(!arrayQuery.includes('limit') || arrayQuery.length > 1 ){
            return res.status(200).json({error:"query with syntax error",query:req.query})
        }

        let {limit} = req.query
        limit = parseInt(limit)
        if(!isNaN(limit) && limit > 0){
            listProducts = productTest.getProducts()
            limit = limit > listProducts.length ? listProducts.length : limit
            return res.status(200).json({success:`returning ${limit} product(s) out of a total of ${listProducts.length}` , data: listProducts.slice(0,limit)})
        }
        
        return res.status(200).json({error:"error in the limit, must be a positive integer",data:req.query.limit.toString()})
    }

    //consultar sin limit
    return res.status(200).json({success:`returning a total of ${productTest.getProducts().length} product(s)`, data: productTest.getProducts()})
})

app.get('/products/:pid', (req, res) => {
    //busca solo si el pid es valido y existe
    let {pid} = req.params
    pid = parseInt(pid)
    if(!isNaN(pid)){
        productFind = productTest.getProductById(pid)
        if(productFind){
            return res.status(200).json({success:`product with id:${pid} found`,data:productFind})
        }
        return res.status(200).json({error:"product no found",data:`id:${pid} no found`})
    }
    return res.status(200).json({error:"invalid id",data:`id:${req.params.pid.toString()}`})
})


