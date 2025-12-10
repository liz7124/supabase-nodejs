import express from 'express'
import dotenv from 'dotenv'
import studentRoutes from './src/routes/studentRoutes.js'
import { supabase } from './src/db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './src/routes/authRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static('public'))

app.use('/api/students', studentRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)

const clients = []

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  clients.push(res)
  console.log('🟢 SSE client connected. Total:', clients.length)

  req.on('close', () => {
    console.log('🔴 SSE client disconnected')
    const index = clients.indexOf(res)
    if (index !== -1) clients.splice(index, 1)
  })
})

const channel = supabase
  .channel('realtime-students')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'students' },
    (payload) => {
      console.log('📡 Realtime Event:', payload.eventType)
      console.log('New:', payload.new)
      console.log('Old:', payload.old)

      // Kirim ke semua client yang connect ke /events
      const data = `data: ${JSON.stringify(payload)}\n\n`
      clients.forEach((res) => res.write(data))
    }
  )
  .subscribe((status) => {
    console.log('🔔 Supabase channel status:', status)
  })

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
