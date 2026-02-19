const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const { User } = require('./models');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now, restrict in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});

// Database Sync and Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Using simply sync() for dev purposes

        // Seed Admin User
        const seedAdmin = async () => {
            try {
                const adminEmail = 'admin@example.com';
                const adminExists = await User.findOne({ where: { email: adminEmail } });
                
                if (!adminExists) {
                    const bcrypt = require('bcryptjs');
                    const hashedPassword = await bcrypt.hash('admin123', 10);
                    await User.create({
                        username: 'Super Admin',
                        email: adminEmail,
                        password: hashedPassword,
                        role: 'admin'
                    });
                    console.log('Super Admin created: admin@example.com / admin123');
                }
            } catch (error) {
                console.error('Error seeding admin:', error);
            }
        };

        server.listen(PORT, async () => {
            console.log(`Server running on port ${PORT}`);
            await seedAdmin();
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();

// Make io accessible to routes
app.set('socketio', io);
