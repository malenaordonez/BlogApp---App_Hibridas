require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Importamos el router
const userRouter = require('./src/routers/userRouter');
const postRouter = require('./src/routers/postRouter');
const categoryRouter = require('./src/routers/categoryRouter');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Conectado a MongoDB exitosamente')).catch((error) => console.error('Error conectando a MongoDB:', error));

//Conectamos las rutas
app.use('/api/usuarios', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/categorias', categoryRouter);

app.get('/', (req, res) => {
    res.send('API REST del Blog funcionando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});