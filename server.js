import express from 'express'
import pool from './db.js'
import { status } from './const.js'
import rootRoutes from './src/routes/root.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

export const app = express()

// Create moddleware to read json data
app.use(express.json())
app.use(express.static('.'))

// Create middleware allowing FE to call API to BE
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true
}))

app.use(cookieParser())
app.use(rootRoutes)

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.get("/test_api", (req, res) => {
    res.send("test api")
})

// Get params from URL
// app.post("/users/:id/:hoten", (req, res) => {
//     let params = req.params
//     let {id, hoten} = params
//     let body = req.body

//     res.send({id, hoten})
// })

// Get query from URL
app.get("/test_query", (req, res) => {
    let query = req.query
    res.send(query)
})

// Get header from request
app.get("/test_header", (req, res) => {
    let headers = req.headers
    res.send(headers)
})


// app.get("/users", async (req, res) => {
//     try {
//         const [data] = await pool.query(`SELECT *FROM users limit 1`)
//         res.status(status.OK).json(data)
//     } catch (error) {
//         res.status(status.INTERNAL_SERVER).json({message: `${error}`})
//     }
// })

app.listen(3000, () => {
    console.log("Server is running ")
})
