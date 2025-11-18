import express from 'express'
import cors from 'cors'
import studentRoutes from './src/routes/studentRoutes.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/api/students', studentRoutes)

app.get('/', (req, res) => {
  res.send('Supabase + Express API is running')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
