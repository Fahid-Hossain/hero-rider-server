const express = require('express');
const cors =require('cors');
const { MongoClient } = require('mongodb');

// app instance 
const app = express();


//apply middle were
app.use(cors());
app.use(express.json());

// process env require

require('dotenv').config()


//mongo client uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ytj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try{
        client.connect();
        console.log('database connected')
        // create data base 
        const heroRiderDatabase = client.db("hero-rider");
        // create data base collections


        //dataBase for all users
        const collectionHeroUsers = heroRiderDatabase.collection("collection-hero-users");

        //add the user to data base here api 
        app.post('/addUser', async(req, res)=> {
            console.log(req.body)
            const result = await collectionHeroUsers.insertOne(req.body);
            res.send(result)
        })
        app.get('/adminCheck/:email', async(req, res)=> {
            const email = req.params.email
            const query = { email: email };
            const result = await collectionHeroUsers.findOne(query);
            let isAdmin = false;
            let data = {admin:isAdmin}
            if(result?.role ==='admin'){
                isAdmin = true;
                data.admin = isAdmin;
             

            }
            res.send(data)
        })


    }
    finally {
        // await client.close()
    }
}run().catch(console.dir)









const port = process.env.PORT || 5000 ;

app.get('/', (req, res)=> {
    res.send('hero rider is running now.....')
})





app.listen(port, ()=> {
    console.log('hero rider is running...', port)
})