const fs = require('fs')
const products = []

class ProductManager{
    constructor(path) {
        this.path = path
    }

    //si existe el archivo
    fileExists = () => {
        if(!fs.existsSync(this.path)){
            console.log('File no found')
            return false
        }
        return true
    }
    
    //si el archivo tiene contenido
    getContentFile = () => {
        let content = fs.readFileSync(this.path,'utf-8')
        if(content.length === 0){
            console.log('Empty File')
            return false
        }
        return content
    }

    //llenar el array auxiliar para manejar los productos
    fillArray = (contFile, arrayAux) => {
        JSON.parse(contFile).map(obj => arrayAux.push(obj))
    }

    //vaciar array auxiliar despues de usarlo
    clearArray = (arrayAux) => {
        arrayAux.length = 0
    }

    //saber si el array del json tiene objetos
    isEmptyArray = (arrayAux) => {
        if( arrayAux.length ){
            return false
        }
        console.log('Array empty')
        return true
    }

    //id autoincrementable
    idAutoincrement = () => {
        return products.length ? products[products.length - 1].id + 1 : 1
    }

    //existen los campos
    fieldsExist(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log(`Missing required fields: 
            ${!title ? 'title' : ''}
            ${!description ? 'description' : ''}
            ${!price ? 'price' : ''}
            ${!thumbnail ? 'thumbnail' : ''}
            ${!code ? 'code' : ''}
            ${!stock ? 'stock' : ''}`)
            return false
        }

        return true
    }

    //codigo repetido
    isRepeatedCode = ( code ) => {
        if(products.some(product => product.code === code))
        {
            console.log('Repeated code')
            return true
        }
        return false
    }


    //obtener todos los productos
    getProducts = () => {

        if(!this.fileExists()){
            return false
        }
        
        let contentFile = this.getContentFile() 
        
        if(!contentFile){
            return false
        }

        this.fillArray( contentFile, products )
        
        if(!this.isEmptyArray( products )){
            let listProducts = products.slice(0,products.length)
            this.clearArray( products )
            return listProducts
        }
        
    }

    //obtener producto por id
    getProductById = (id) => {
        if(!this.fileExists()){
            return false
        }
        
        let contentFile = this.getContentFile() 
        
        if(!contentFile){
            return false
        }

        this.fillArray( contentFile, products )

        if(!this.isEmptyArray( products )){
            const productFind = products.find(product => product.id === id)
            this.clearArray( products )
            return productFind ? productFind : false
        }
  
    }

    //agregar producto
    addProduct = (title, description, price, thumbnail, code, stock ) => {
        
        if(!this.fieldsExist(title, description, price, thumbnail, code, stock)){
           return false
        }

        if(this.fileExists()){
            let contentFile = this.getContentFile() 
            if(contentFile){
                this.fillArray( contentFile, products )
            }
        }
        
        if(this.isRepeatedCode(code)){
            return false
        }

        products.push({
            id: this.idAutoincrement(), 
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock
        })

        fs.writeFileSync(this.path,JSON.stringify(products,null,4))
    }

    //actualizar producto
    updateProduct = (id, updateData) => {
        if(!this.fileExists()){
            return false
        }
        
        let contentFile = this.getContentFile() 
        
        if(!contentFile){
            return false
        }

        this.fillArray( contentFile, products )

        if(!this.isEmptyArray( products )){
            const productIndex = products.findIndex(product => product.id === id)
            if(productIndex > 0){
                products[productIndex] = {id:products[productIndex].id, ...updateData}
                fs.writeFileSync(this.path,JSON.stringify(products,null,4))
                console.log(`Product whit ID: ${id} updated`)
            } else{
                console.log(`Product whit ID: ${id} no Found`)
            }
            this.clearArray( products )
        }
    }

    //eliminar producto
    deleteProduct = (id) => {
        if(!this.fileExists()){
            return false
        }
        
        let contentFile = this.getContentFile() 
        
        if(!contentFile){
            return false
        }

        this.fillArray( contentFile, products )

        if(!this.isEmptyArray( products )){
            const productIndex = products.findIndex(product => product.id === id)
            if(productIndex > 0){
                products.splice(productIndex,1)
                fs.writeFileSync(this.path,JSON.stringify(products,null,4))
                console.log(`Product whit ID: ${id} deleted`)
            } else{
                console.log(`Product whit ID: ${id} no Found`)
            }
            this.clearArray( products )
        }
    }

}

module.exports = ProductManager