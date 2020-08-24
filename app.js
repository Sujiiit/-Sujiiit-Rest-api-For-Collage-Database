let express,app,bodyparser,mongoose,_,globalid;

  express = require('express');
  bodyparser = require('body-parser');
  mongoose = require('mongoose');
  _ = require('lodash');

  app = express();
  app.set("view engine", "ejs"); //to use the ejs 
  app.use(bodyparser.urlencoded({extended: true}));
  app.use(express.static('Public'));

   // Image uploading tools

   let fs = require('fs'); 
   let path = require('path'); 
   require('dotenv/config'); 
   let multer = require('multer'); 

    
    // Data for the post Route

  let storage = multer.diskStorage({ 
      destination: (req, file, cb) => { 
      cb(null, 'uploads') 
     }, 
      filename: (req, file, cb) => { 
      cb(null, file.fieldname + '-' + Date.now()) 
     } 
  }); 

  let upload = multer({ storage: storage }); 


      // Creating  Database Todolist
    mongoose.connect('mongodb://localhost:27017/Blog',{ useNewUrlParser: true ,useUnifiedTopology: true }); 


     // Creating collection ( post )
    const postschema = {  title: String , content: String , key: Number , img: {data: Buffer,  contentType: String }  };
    const Post = mongoose.model('Post',postschema);

 

     let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     let today  = new Date(),  date = today.toLocaleDateString("en-US", options);


     const Listschema = { name: String , Items: [postschema] }
     const List = mongoose.model('List',Listschema);
  

    
       // Home Get Routes
     app.get("/",  ( (req,res) => { 

        Post.find({},function(err,foundItems)
         {
           if(!err)
            {  
             
             (foundItems.length > 0) ? globalid = Number( foundItems[foundItems.length-1].key ) + 1  :  globalid = 1;
            	function compare(a,b) 
            	  {
            	  	  if (a.key > b.key) return -1;
                      if (b.key > a.key) return 1;
                      return 0;
                     // return a.key - b.key;
                  }  
                              
                 res.render('Main',{Posts: (foundItems.sort(compare)), inside: false}); 
             
            } 
         });
  	     
  	 }));



  app.get('/about',   ( (req,res) =>  { res.render('Aboutus',{Title: 'Aboutus page',paragraph: lorem})  }))
  app.get('/contact', ( (req,res) =>  { res.render('contact',{Title: 'Contact page',paragraph: lorem})  }))
  app.get('/compose' ,( (req,res) => { res.render('compose',{Title: 'Compose page'})  }))

     
   

  app.get('/:parameter', ( (req,res) => {

        let finditem = _.lowerCase(req.params.parameter);

  	    Post.find({},function(err,foundItems) {
           if(!err) {
             
             let foun = foundItems.filter(function(item){ return _.lowerCase(item.title) === finditem})
             if(foun.length > 0)
               {
                  res.render('Main',{Posts: foun, inside: true})
               }
                else
               {
                  // res.render('post',{Title: "OOP's we can't find page",Content: ''})
               }
           } 
        });


    }))



  app.post('/search', ( (req,res) => { 
      

        let finditem = _.lowerCase(req.body.title);

  	     Post.find({},function(err,foundItems) {
           if(!err) {
             
             let foun = foundItems.filter(function(item){ return _.lowerCase(item.title) === finditem})
             if(foun.length > 0)
               {
                  res.render('Main',{Posts: foun, inside: true})
               }
                else
               {
                  // res.render('post',{Title: "OOP's we can't find page",Content: ''})
               }
           } 
        });
      

  }))






 app.post('/', upload.single('image'),  (req,res) => { 

 	             
 	             let nepost = new Post ({

 		            title:  req.body.posttitle,
 		            content:  req.body.postcontent,
 		            key:  globalid,
                img: { 
                       data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
                       contentType: 'image/png'
                     }	
 	              });
                  
                  nepost.save();  
                  res.redirect('/')
});









 app.listen(3000, ( ()  => { console.log('Server started on port 3000.');  }));

	
