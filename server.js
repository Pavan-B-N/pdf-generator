const express = require("express")
const app = express()

const { v4: uuid } = require("uuid")
var dateFormat = require('date-format');
const {jsPDF}=require("jspdf")
app.use(express.static("payment_pdfs"))
app.use(express.json())

app.get("/:uname",(req,res)=>{
    res.send("sorry , your pdf is not yet generated try again later")
})

app.post("/", (req, res) => {
    const { name, srn, amount, gateway, status } = req.body
    const data = [];
    data.push("Name : " + name);
    data.push("SRN : " + srn);
    data.push("Amount : " + amount);
    data.push("Gateway : " + gateway);
    data.push("Transaction id : " + uuid());
    data.push("Status : " + status)
    if(status==="Failed"){
        data.push("Reason : " + req.body.reason)
    }
    data.push("Date : "+dateFormat.asString(new Date()))

    const doc=new jsPDF();
    let x=10;
    let y=10;
    data.forEach(line => {
        doc.text(line,x,y)
        y+=10;
    })
    doc.save(__dirname+"/payment_pdfs/"+name+".pdf")
    res.send("http://localhost:3030/"+name+".pdf")
})

app.listen(3030)