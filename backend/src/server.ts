import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string, 
).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
app.get('/', (req, res) => {
  res.send('Welcome to the Wanfam API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});