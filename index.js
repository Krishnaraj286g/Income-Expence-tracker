let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let port = 1120;
let app = express();
app.use(express.json());
app.use(cors());

let url = "mongodb+srv://income-expense:income@cluster0.wk3zk.mongodb.net/income_expense?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(url).then((res)=>console.log("DB Connected successfully")).catch((err)=>console.log(err))

let collection = mongoose.model("Customer_data",{
    username:String,
    usertype:String,
    useramount:Number
});

app.post("/",async(req,res) => {
    let {username,usertype,useramount} =req.body;
    let data = new collection({username,usertype,useramount})
    await data.save()
    res.json({msg:"Stored successfully",data})
})

app.get("/",async (req,res) => {
    let data = await collection.find()
    res.json({msg:data})
})

app.get("/:id",async (req,res) => {
    let {id} = req.params;
    let data = await collection.findById(id)
    res.json({msg:"Data getting",data})
})

app.delete("/:id",async(req,res) => {
    let {id} = req.params;
    let data = await collection.findByIdAndDelete(id)
    res.json({msg:"deleted"})
})

app.put("/:id",async (req,res)=>{
    let {id}=req.params;
    let data=await collection.findById(id)
    data.username=req.body.username;
    data.usertype=req.body.usertype;
    data.useramount=req.body.useramount;
    await data.save()
    res.json({msg:'updated',data})
})




app.listen(port,console.log("server running",port));
