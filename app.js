let express,app,mongoose;

   express = require('express');
   mongoose = require('mongoose');
   app = express();
   app.use(express.urlencoded({ extended: true }));
   app.use(express.json());
   let StarterFile = require('./Starter');
   
   // Listning on port 5000
   app.listen(5000, ( ()  => { console.log('Server started on port 5000.');  }));
   
 

   // Creating  Database SchoolDatabase 
   //   We are not using any kind of encryption
    mongoose.connect('mongodb+srv://sujiiit:FAaE434gYofRwvfN@cluster0.rrkr2.mongodb.net/SchoolDatabase',{ useNewUrlParser: true ,useUnifiedTopology: true });
    

     let dataSchema = ({
     ROLL_NO: String, NAME: String, CLASS: String,
     SECTION: String, DOB: String, Admission_No: String,
     EMAIL: String, PASSWORD: String, first: '',
     second: '',third: '',forth: '',fifth: '',sixth: ''
     }); 
     let Students = mongoose.model('Students',dataSchema); 

  
          
//   Home Get Routes
   let list = StarterFile.list;

     
     app.get("/Home", function(req, res) {
        Students.find({},function(error,response){
        if(!error)
            {
               if(!response.length){
               //  if the database is empty then we create some  empt fields
                Students.insertMany([...list],function(err){
                  (!err) && console.log('data entered Successfully.');
                  });             
                 
                    fetchtitles().then((title) => {
                    res.send([title,list])   
                    }).catch((message) => {
                    })
                         
               }
               else{
                  // Data already exist so we sending them.
                  fetchtitles().then((title) => {                
                     res.send([title,response])                
                     }).catch((title) => {   
                     })
               }
            } 
            else{
               console.log(error);
            }
        }).limit(10);
        
     });

   

     app.post("/Home", function(req, res) {
        let alldata = req.body.alldata,i=0,len = alldata.length,temp=0;
        console.log(alldata);
       while(i<len){              
          if( (i+1) < len ){
            if(alldata[i].id !== alldata[i+1].id || alldata[i].key !== alldata[i+1].key){
                savedata(alldata[i].id,alldata[i].key,alldata[i].val);
             } 
            
           }
           else {
               savedata(alldata[i].id,alldata[i].key,alldata[i].val);
          }      
           i++;
          }     
        
      });



  
   let TitleSchema =  ({  titlename: String  });
   let Title = mongoose.model('Title',TitleSchema);
   const Source =  StarterFile.Source;
   
 
app.post('/title',function(req,res){
      
   let alldata = req.body.alldata,i=0,len = alldata.length,temp=0;
     while(i<len){              
         if( (i+1) < len ){

           if(alldata[i].ID !== alldata[i+1].ID){
           savetitle(alldata[i].ID,alldata[i].V);
          }    
        }
         else {
               savetitle(alldata[i].ID,alldata[i].V);
             }      
        i++;
      }     

});







function savedata(ID,fieldname,value=''){
  
   if(ID.length !== 0){
   
   Students.findOne({_id: ID},function(err,response){
      if(err) {
          console.log(err);
      }
      else  {      
       Students.updateOne({'_id': ID},{[fieldname]: value}, function(error) {
              if(error) {  console.log(error) } else { console.log('updated successfully.')}
           });
          }    

   });
 } // Id length
}




 function fetchtitles(){
   var Titls=[];
    return new Promise((resolve,reject) => {
        Title.find({}, function(err,response){    
        if(!err) {
          if(!response.length){
            //   Inserting some normal titles
            Title.insertMany([...Source],function(err){
            (!err) && console.log('Some basic titles saved.');
         });            
               resolve(Source);
        }    //  response length
      else{
          let oue = Object.entries(response);
          Titls = oue.map((element,index) => {
          Titls.push(element); 
          if(index == oue.length-1) { 
                 resolve(Titls);
               
             }    
      });
   }   // Else scope
   
   }  // Error barcket
})
      
});
}


function savetitle(T,V)  {
   if(T !== '') {
   Title.findOne({_id: T},function(err,response){
      if(!err) {
           Title.updateOne({'_id': T},{titlename: V}, function(error) {
              if(error) {  console.log(error) } else { console.log('updated successfully.')}
           });
        }  
   })
  }
}


app.post('/addpage',(req,res) => {
   Students.insertMany([...list],function(err){
      (!err) && console.log('data entered Successfully.');
      }); 
      fetchtitles().then((title) => {
         res.send([title,list])
         }).catch((message) => {
         })
})


let page = 0;
app.get('/nextpage',(req,res) => {
 page++;
    Students.find({},function(error,response){
      if(!error)
          {
             if(!response.length){
             //  if we found nothing then
                res.send("Page does'nt exist");
                page--;
               }
               else{
                  res.send(response);
               }
            }

            else{
               console.log(error)
            }
      }).skip(page*10).limit(10);
});



app.get('/prevpage',(req,res) => {
   page--;
   Students.find({},function(error,response){
     if(!error)
         {
            if(!response.length){
            //  if we found nothing then
            
               res.send("Page does'nt exist");

              }
              else{
                res.send(response);
              }
           }
     }).skip(page*10).limit(10);
});


app.get('/search',(req,res) => {

    let tofind = req.query.key,found = false; 
         
       
            fetchtitles().then((title) => {
               title.map((item) => { (!found) && findby(item[1].titlename,tofind)  });
               });  
      

       setTimeout(() => {(!found) &&  res.send('nothing found')},500);
     

  function findby(item,tofind){
   Students.find({[item]: tofind},function(error,response){
     
      if(!error)
          {
             if(!response.length){
             //  if we found nothing then...
               //  res.send("Page does'nt exist");
               }
               else{
                  
                  res.send(response); 
                  found = true; 
               }
            }

            else{
               console.log(error);
            }
      })
    }
});
