import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// App routes
server.app.use('/user', userRoutes);

// DB connection and creation
mongoose.connect('mongodb://localhost:27017/jlpics',
    { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });

// Test to see that the server is running
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
})
