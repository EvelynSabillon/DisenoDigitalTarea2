import express from 'express';
import productos from './local_db/productos.json' with { type: 'json' }

const app = express(); // para crear la aplicación de express
const PORT = process.env.PORT || 3000; // puerto donde se ejecutará la aplicación   

// middleware
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})