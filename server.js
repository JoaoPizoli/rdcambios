import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import adminRoutes from './src/router/adminRoutes.js';
import clienteRoutes from './src/router/clienteRoutes.js'
import carroRoutes from './src/router/carroRoutes.js'
import auth from './src/middleware/auth.js';

const app = express()

app.use(express.json())

app.use('/admin',adminRoutes)

app.use('/clientes', auth, clienteRoutes)
app.use('/carros', auth, carroRoutes)


const PORT = 3000
app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`)
})
