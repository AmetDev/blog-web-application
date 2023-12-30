import { configDotenv } from 'dotenv';
import express from 'express'
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
const PORT = process.env.PORT || 5000

const app = express();
app.get('/', (req, res)=>{
  res.send("hello world!");
});

app.listen(PORT, (err)=>{
  if(err){
    return err;
  }
  console.log(`SERVER START ON PORT ${PORT}`)
});
