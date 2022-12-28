import myjson from "./data/data.json" assert {type:"json"}
import express from 'express'
const app = express();


app.get('/',(req,res)=>{
    console.log("here")

    res.json(myjson)
   
})
app.listen(3000)