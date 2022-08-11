const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/',async(req,res)=>{
    var url = 'http://localhost:8080/validate';
    var options = {
        "valid":1
    };
    let final = await retryFetch(url,options);
    console.log(`final value is ${final}`);
    res.send(final);
});

function retryFetch(url,options){
    return fetch(url,{
        method:'POST',
        body: JSON.stringify(options),
        headers: { 'Content-Type': 'application/json' }
    }).then((res)=>res.json().then((myJson)=>{
        if(myJson.status==200){
            return myJson;
        }
        options['valid']+=1;
        return retryFetch(url,options);
    }));
}

app.listen(PORT,()=>{console.log(`Rerty API Application listening on port ${PORT}.`);});