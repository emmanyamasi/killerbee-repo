//dotenv
//express instance
//load variables
//enable all important middleware
//create all routes 
//load more middleware - eg error handlers
//start the server 
import express from 'express'
import dotenv from 'dotenv'

import cors from "cors"
import authRoutes from './routes/authRoutes'



// 1:dotenv
dotenv.config()

//2:instance of express  
const app = express()

//3:NEVER IN YOUR LIFE FORGET THIS 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//Cookie parser middleware


//enable cors with optiosn (RECOMMENDED)
//To allow only http://localhost:5173:
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, PUT,DELETE",
    credentials: true //allows cookies and auth headers
}))


//4. routes 

app.use("/api/v1/auth", authRoutes)


//5. middlewares for error handlers 


//6: start the serve 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`🚀🚀 server is running on port - ${PORT}`)
})