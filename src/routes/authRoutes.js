import express from 'express'
import { supabaseAuth } from '../db.js'

const router = express.Router()

//Register
router.post('/register', async (req, res) => {
    //console.log(req.body);
    const { name, email, password } = req.body
    const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: name },
            emailRedirectTo: 'http://localhost:3000/login.html'
        }
    })
    if (error)
        return res.status(400).json({ error: error.message })

    return res.json({
        message: "Registration success. Please verify your email.",
        redirect: "/verify.html",
        user: data.user
    })
})

//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
    })
    
    if (error)
        return res.status(400).json({ error: error.message })

    return res.json({
        message: 'User logged in successfully',
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: data.user
    })
})

//Get current user (requires access token)
router.get('/me', async (req, res) => {
    
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data, error } = await supabaseAuth.auth.getUser(token)

    if (error) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    return res.json(data)
})

//Logout
router.post('/logout', async (req, res) => {
    const refreshToken = req.body.refresh_token

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' })
    }

    const { error } = await supabaseAuth.auth.signOut({ refreshToken })

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    return res.json({ message: 'User logged out successfully' })
})

export default router
