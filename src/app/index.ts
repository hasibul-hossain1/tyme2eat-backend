import { toNodeHandler } from "better-auth/node";
import express from "express"
import {auth} from '../lib/auth.js'
import router from "../routes/index.js";
import cors from 'cors'
import { globalErrorHandler } from "../middleware/error.middleware.js";

const app = express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:3000","http://192.168.0.30:3000"],
    credentials:true
}))

app.use((req,res,next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next()
})

app.all('/api/v1/auth/{*any}', toNodeHandler(auth));


app.use('/api/v1',router)

app.use(globalErrorHandler)

app.get('/',(req,res) => {
    res.send("The server is working")
})

export default app