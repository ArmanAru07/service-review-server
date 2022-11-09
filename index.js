const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('genius csr server is running')
})

app.listen(post, () =>{
    console.log(`Genius car server running on ${port}`);
})