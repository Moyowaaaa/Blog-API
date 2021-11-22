const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongodb = require('mongodb')

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(cors());


//Database
async function PostCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost/Blog' ,{ useUnifiedTopology: true,
        useNewUrlParser: true
    
    });

    return client.db('Blog').collection('Posts');
    
}



//get Posts 
app.get('/', async (req,res) => {
    const Post = await PostCollection();
    res.send(await Post.find({}).toArray());

})

//create Post
app.post('/',async(req,res) => {
    const Post = await PostCollection();
    await Post.insertOne({
        Title: req.body.Title,
        Body: req.body.Body,
        createdAt: new Date()
    })
    res.status(200).send();
 
})

//specific post

app.get('/:id', async(req,res) => {
    
    try{
        const Post = await PostCollection();
        res.send(await Post.findOne({_id: new mongodb.ObjectId(req.params.id)}))
    }
    catch(err) {
        console.log(err)
    }
})





//delete
app.delete('/:id', async(req,res) => {
    try{
        const Post = await PostCollection();
        await Post.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
        res.status(200).send();
    }
    catch(err) {
        console.log(err)
    }
})




const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Lets go on ${PORT}`))