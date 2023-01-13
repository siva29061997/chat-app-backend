require('dotenv').config();
const express = require('express');
const db = require('./db/connection');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const cookieParser = require('cookie-parser');
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//Importing routes
const authRoutes = require('./routes/auth.routes'); //custom middleware
const chatRoutes = require('./routes/chat.routes');
const userRoutes = require('./routes/user.routes');

//Connecting DB.
db();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


app.get('/', (req, res) => {
    res.send('Welcome!!!');
})


app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', userRoutes);

// on -> receiving side.
// emit -> sending side.

io.on('connection', (socket) => {
    console.log('Socket:', socket);
    console.log('User connected: ', socket.id);

    socket.on('join', (data) => {
        socket.join(data);
        console.log(`user ${socket.id} has joined the room ${data}`);
    });

    socket.on('send-message', (data) => {
        socket.to(data.room).emit('receive-message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})

