import express from 'express'
import { writeFileSync, readFileSync } from 'node:fs'
import productos from './local_db/productos.json' with { type: 'json' }


const app = express(); 
const PORT = process.env.PORT || 3000;  

//funciones 
const guardarCambios = () => {
    writeFileSync('./local_db/productos.json', JSON.stringify(productos, null, 2));
};

const generarId = () => {   
    try {
        
        const data = readFileSync('./local_db/productos.json', 'utf-8')
        const productosExistentes = JSON.parse(data)

        if (productos.length === 0) {
            return 10000; 
        }

        const ids = productosExistentes.map(producto => producto.id)
        const maxId = Math.max(...ids)

        return maxId + 1;

    } catch (error) {
        
        console.error('Error al generar el ID:', error);
    }
};

//middleware
app.use(express.json());

//Retorna un listado con todos los productos
app.get('/productos', ( req, res ) => {
    try {

        let contador = 0;
        productos.forEach(() => {contador++;});

        res.json({
            message: `Hay ${contador} productos`,
            data:productos
        });
        
    } catch (error) {
        
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
        
    }
});

// Devuelve únicamente los productos que están marcados como disponibles (disponible: true)
app.get('/productos/disponibles', ( req, res ) => {
    
    try {

        let contadorTotal = 0;
        productos.forEach(() => {contadorTotal++});


        const productosDisponibles = productos.filter((producto) => { 
            return producto.disponible === true
        })

                
        const contadorDisponibles = productosDisponibles.length;


        if (productosDisponibles.length === 0) {
            return res.status(404).json({   
                message: 'No hay productos disponibles en este momento'
            });
        }

        res.json({
            message: `Hay ${contadorDisponibles}/${contadorTotal} productos disponibles`,
            data: productosDisponibles
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }

});


//Retorna la información del producto con el ID especificado
app.get('/productos/:id', ( req, res ) => {
    
    try {
        const { id } = req.params
        const parsedId = Number(id)
        
        if (isNaN(parsedId)) {
            res.status(400).json(
                { message: `El ID ${ id } no existe` }
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

        res.json(producto);
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
        
    }

});


// Permite agregar un nuevo producto
app.post('/productos', ( req, res ) => {
    
    try {

        const { nombre, precio, descripcion, disponible } = req.body

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es obligatorio' })
        }

        let precioFinal;
        if (typeof precio === 'string') {
            const parsedPrecio = parseFloat(precio);
            if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
                return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
            }
            precioFinal = parsedPrecio;
        } else if (typeof precio === 'number') {
            if (precio <= 0) {
                return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
            }
            precioFinal = precio;
        } else {
            return res.status(400).json({ message: 'El precio debe ser un número' });
        }

        if (!descripcion || descripcion.length < 10) {
            return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres' })
        }

        let disponibleFinal = disponible;
        if (typeof disponible === 'string') {
            if (disponible.toLowerCase() === 'true') {
                disponibleFinal = true;
            } else if (disponible.toLowerCase() === 'false') {
                disponibleFinal = false;
            } else {
                return res.status(400).json({ message: 'El campo disponible debe ser true o false' });
            }
        }

        const nuevoProducto = {
            id: generarId(),
            nombre,
            precio: precioFinal,
            descripcion,
            disponible: disponibleFinal,
            fecha_ingreso: new Date()
        }

        productos.push(nuevoProducto)
        guardarCambios()

        res.status(201).json({
            message: 'Producto agregado exitosamente',
            data: nuevoProducto
        });
        
    } catch (error) {
        
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }

});


//Permite modificar los datos de un producto existente
app.put('/productos/:id', ( req, res ) =>{
    
    const { id } = req.params
    const parsedId = Number(id)

    try {

        if (isNaN(parsedId)) {
            return res.status(400).json(
                { message: `El ID ${ id } no existe` }
            )  
        }

        const data = req.body

        const index = productos.findIndex(({ id }) => {
            return id === parsedId
        })

        if (index === -1) {
            return res.status(404).json({
                message: `No se encontró un producto con el ID ${parsedId}`
            })

        } 
        
        if (!data.nombre) {
            return res.status(400).json({ message: 'El nombre es obligatorio' })
        }

        if (typeof data.precio === 'string') {
            const parsedPrecio = parseFloat(data.precio);
            if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
                return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
            }
            data.precio = parsedPrecio;
        } else if (typeof data.precio === 'number') {
            if (data.precio <= 0) {
                return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
            }
        } else {
            return res.status(400).json({ message: 'El precio debe ser un número' });
        }

        if (!data.descripcion || data.descripcion.length < 10) {
            return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres' })
        }

        if (typeof data.disponible === 'string') {
            if (data.disponible.toLowerCase() === 'true') {
                data.disponible = true;
            } else if (data.disponible.toLowerCase() === 'false') {
                data.disponible = false;
            } else {
                return res.status(400).json({ message: 'El campo disponible debe ser true o false' });
            }
        }

        data.fecha_ingreso = productos[index].fecha_ingreso;

        const productoUpdated = { id: parsedId, ...data }
        productos[index] = productoUpdated
        guardarCambios()

        res.status(200).json({
            message: `Producto con ID ${parsedId} actualizado exitosamente`,
            data: productoUpdated
        });

    } catch (error) {
        
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }

});


// Elimina un producto con base en su ID
app.delete('/productos/:id', ( req, res ) => {
    
    const { id } = req.params
    const parsedId = Number(id)
    
    try {

        if (isNaN(parsedId)) {
            return res.status(400).json(
                { message: `El ${ id } debe ser un numero` }
            )  
        }

        const index = productos.findIndex(({ id }) => {
            return id === parsedId
        })

        if (index === -1) {
            return res.status(404).json({
                message: `No se encontró un producto con el ID ${parsedId}`
            })
        }

        productos.splice(index, 1)
        guardarCambios()

        res.status(200).json({
            message: `Producto con ID ${parsedId} eliminado exitosamente`
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });

    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})