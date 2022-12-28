import myjson from "./data/data.json" assert {type:"json"}
import express from 'express'
import cors from 'cors'

app.use(cors({
    origin:"http://localhost:5173/"
}))
app.get('/',(req,res)=>{
    console.log("here")

    res.json(myjson)
   
})
app.listen(3000)