//dotenv
//express instance
//load variables
//enable all important middleware
//create all routes 
//load more middleware - eg error handlers
//start the server 
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from './routes/authRoutes'
import employeeRoutes from "./routes/employeeRoutes";
import modelRoutes from './routes/modelRoutes'
import ingredientRoutes from './routes/ingredientRoutes'
import modelIngredientRoutes from './routes/modelIngredientRoutes'



import processRoutes from "./routes/processesRoutes";



// 1:dotenv
dotenv.config()

//2:instance of express  
const app = express()

///3:NEVER IN YOUR LIFE FORGET THIS 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//Cookie parser middleware
app.use(cookieParser())
//eneable CORS for all origins  
// app.use(cors())



//enable cors with optiosn (RECOMMENDED)
//To allow only http://localhost:5173:
app.use(cors({
    origin: "http://localhost:4200",
     allowedHeaders: ['Content-Type', 'Authorization'], 
    methods: "GET, PUT,DELETE,OPTIONS,POST,",
    credentials: true //allows cookies and auth headers
}));


app.get("/", (req, res) => {
  res.send("🚀 KillerBee backend is running!");
});

//4. routes 

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/employees", employeeRoutes);

app.use("/api/v1/models", modelRoutes);


app.use("/api/v1/ingredients", ingredientRoutes);

//5. middlewares for error handlers 

app.use("/api/v1/model-ingredients", modelIngredientRoutes);
app.use("/api/v1/processes", processRoutes);

//6: start the serve 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`🚀🚀 server is running on port - ${PORT}`)
})

