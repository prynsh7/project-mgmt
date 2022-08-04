import express from "express"
const app=express()
import dbConnect from "./config/config.js"

app.get("/",(req,res)=>{
    res.send("hi there!")
})

app.listen(9000,()=>{
    console.log(`listening at port http://localhost:9000`)
})