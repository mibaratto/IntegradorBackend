import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Server running on port ${Number(process.env.PORT) || 3003}`)
})

//app.use("/users", userRouter)
//app.use("/posts", postRouter)



app.get("/ping", (req, res) => {
    res.send("Pong! Integrador Backend")
})