const express = require('express');
const cors =require('cors');
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload')

// app instance 
const app = express();


//apply middle were
app.use(cors());
app.use(fileUpload())
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


        //dataBase collection for all users
        const collectionHeroUsers = heroRiderDatabase.collection("collection-hero-users");
        //database collection for user multimedia 
        const collectionUsersMultimedia = heroRiderDatabase.collection("collection-hero-multimedia");
        //add the user to data base here api 
        app.post('/addUser', async(req, res)=> {
            console.log(req.body)
            const result = await collectionHeroUsers.insertOne(req.body);
            res.send(result)
        })
        //check admin
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

        //get all users from admin dashboard 
        app.get('/users', async(req, res)=> {
            console.log(1)
            const cursor = await collectionHeroUsers.find({}).toArray()
            const users = cursor.filter(ele => ele.role !=='admin');
            console.log(users)
            res.send(users)
        })

        // post the all file data from here 

        app.post('/fileUpload', async(req, res)=> {
           
            console.log(1)
            console.log(req.body);
            console.log(req.files);
            const email = req.body.email;
            //nid buffer
            const nid = req.files.nid;
            const nidData = nid.data;
            const encodedString = nidData.toString('base64');
            const nidBuffer = Buffer.from(encodedString,'base64');

            //profile buffer
            const pro = req.files.pro;
            const proData = pro.data;
            const encodedStringPro = proData.toString('base64');
            const proBuffer = Buffer.from(encodedStringPro,'base64');

            //  driving pic buffer
            //  const drive = req.files.driving;
            //  const driveData = drive.data;
            //  const encodedStringdrive = driveData.toString('base64');
            //  const driveBuffer = Buffer.from(encodedStringdrive,'base64');




            const fileData ={
                email, nidBuffer, proBuffer

            }
            console.log(fileData);
            const result = await collectionUsersMultimedia.insertOne(fileData);
            res.send(result)
            


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