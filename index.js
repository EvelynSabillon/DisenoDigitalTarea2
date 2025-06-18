import express from 'express';
import productos from './local_db/productos.json' with { type: 'json' }

const app = express(); // para crear la aplicación de express
const PORT = process.env.PORT || 3000; // puerto donde se ejecutará la aplicación   

// middleware
app.use(express.json());

//Retorna un listado con todos los productos
app.get('/productos', ( req, res ) =>{
    res.json(productos);
});

//Retorna la información del producto con el ID especificado
app.get('/productos/:id', ( req, res) =>{
    const { id } = req.params

    const parsedId = Number(id)

    if (isNaN(parsedId)) {
        res.status(400).json(
            { message: 'El ID debe ser un número' }
        )  
    }

    const producto = productos.find(({ id }) => {
        return id === parsedId
    })

    if (!producto) {
        res.status(404).json({
                message: `No se encontró un producto con el ID ${parsedId}`
        })
    }

    res.json(producto)
});

// Permite agregar un nuevo producto
app.post('/productos', ( req, res ) =>{
    let id  = 10000;
    const generarId = () => { return id++ }

    req.body.id = generarId()


    productos.push(req.body)

    res.status(201).json({
        message: 'Producto agregado exitosamente',
        data: req.body
    })


});

//Permite modificar los datos de un producto existente
app.put('/productos/:id', ( req, res ) =>{

});

// Elimina un producto con base en su ID
app.delete('/productos/:id', ( req, res ) =>{

})

// Devuelve únicamente los productos que están marcados como disponibles (disponible: true)
app.get('/productos/disponibles', ( req, res ) =>{

});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})