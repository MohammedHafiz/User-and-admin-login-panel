var express = require('express');
const userHelper = require('../helpers/userHelper');
var router = express.Router();
var adminhelper = require('../helpers/userHelper');



/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// function loginCheck(req,res,next){
//   if(req.session.login){
//     next();
//   }else{
//     res.redirect('/');
//   }
// }

function loginCheck(req,res,next){
  if(req.session.login){
    next();
  }else{
    res.redirect('/admin');
  }
}
const Username = "123";
const Password = "123";

router.get("/",(req,res) =>{
  
  if(req.session.login){
    
    res.redirect('/admin/adminHome') 
  }else{
    if(req.session.attempt){
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render("admin_login",{error:"Invalid Admin",layout:null});
      req.session.attempt = false;
    }else{
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render('admin_login',{layout:null});
    }
    
  }
})
router.get('/adminHome',(req,res) =>{
  
  if(req.session.login){
    
    userHelper.getAllUsers().then((data) =>{
      //console.log(data);
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      
      res.render('admin_home',{admin:true,data});
    }) 
  }
  else{
    res.redirect('/admin')
  }
  
})
router.get('/adminUser',loginCheck,(req,res) =>{

    res.render('addUser',{layout:null});
  
 
})
// router.post('/adminUser',(req,res) =>{
//   userHelper.addUser(req.body,(result)=>{
//     res.redirect('/admin/adminHome');

//   })
  
// })
router.get('/deleteUser/:id',(req,res)=>{
  let userId = req.params.id;
  userHelper.deleteUser(userId)
    res.redirect('/admin/adminHome')
})

router.get('/adminEdit/:id',async(req,res)=>{
  console.log("start");
  let user = await userHelper.getUserDetails(req.params.id)
  // console.log(user);
  res.render('admin/editUser',{layout:null,user});
})

router.post('/adminEdit/:id',(req,res)=>{

  userHelper.updateUserDetails(req.params.id,req.body).then(()=>{
    console.log("admin");
    res.redirect('/admin/adminHome')
  })

})

router.post('/admin-Home',(req,res) =>{
 
    if(Username==req.body.Username && Password==req.body.Password){
      req.session.login = true
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.redirect('/admin/adminHome');
      
    }else{
      req.session.attempt = true
      res.redirect('/admin')
    }
})
router.post('/adminHome',(req,res) =>{
  userHelper.addUser(req.body,(result)=>{ 
    res.redirect('/admin/adminHome')
  })
})
router.get('/logout',(req,res) =>{
  delete req.session.login;
  res.redirect("/admin");
  
})





module.exports = router;
