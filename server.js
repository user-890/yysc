const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const socket = require('socket.io');
const socketEvents = require('./middleware/socketEvents');

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(cors({}));

// Initialize Middleware
app.use(express.json({ extended: false }));

// Route Definitions
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/upload', require('./routes/api/upload'));
app.use('/api/resource', require('./routes/api/resource'));
app.use('/api/message', require('./routes/api/message'));
app.use('/api/log', require('./routes/api/tracking'));

app.get('/', (req, res) => res.send('API Running...'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Socket 
const io = socket(server);
socketEvents(io);

