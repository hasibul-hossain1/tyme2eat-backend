import { toNodeHandler } from "better-auth/node";
import express from "express"
import {auth} from '../lib/auth.js'
import router from "../routes/index.js";
import cors from 'cors'
import { globalErrorHandler } from "../middleware/error.middleware.js";
import { webhookHandler } from "../utils/webhookHandler.js";
import cookieParser from "cookie-parser";

const app = express()

// ⚠️ Webhook must come BEFORE body parsing middleware
app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler)


app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000","http://192.168.0.30:3000","https://tyme2eat.vercel.app"],
    credentials:true
}))

app.use((req,res,next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next()
})
app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.use('/api/v1',router)


app.get('/',(req,res) => {
    res.send("The server is working")
})

app.use(globalErrorHandler)

export default app