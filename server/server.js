const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});

app.use(cors());

app.post('/api/add-user', async(req, res)=>{
    
});