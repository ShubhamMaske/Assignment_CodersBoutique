import express from 'express';
import sequelize from './utils/database.js'
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000
dotenv.config();

app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is listning on port ${PORT}`));
  })
  .catch(err => console.log('Error: ' + err));
