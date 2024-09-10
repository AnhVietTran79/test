const mongoose = require('mongoose');
const express = require('express');
const app = express();

const methodOverride = require('method-override');

// Connect to MongoDB
mongoose.connect(`mongodb+srv://caelumz1121:CzYy11210819@cluster0.62nvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set the view engine and views directory on the app instance
app.set('view engine', 'ejs');
app.set('views', './views/users');

app.use(express.static('public'));

// Middleware and routes
const userRouter = require('./routes/userRoute');
app.use('/', userRouter);

const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

const blogRoute = require('./routes/blogRoute');
app.use('/blog', blogRoute);

const cartRoute = require('./routes/cartRoute');
app.use('/cart', cartRoute);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});

