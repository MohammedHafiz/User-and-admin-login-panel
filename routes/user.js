var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var userHelper = require('../helpers/userHelper');

var products = [
  {
    name: "Shirts",
    category: "Fashion",
    description: "Buy 2 Get 1 Free",
    image:
      "https://ae01.alicdn.com/kf/HTB1w.oNPXXXXXbVXVXXq6xXFXXX9/100-Cotton-Gradient-Blue-Jeans-shirt-men-fashion-Unique-personality-denim-shirt-men-Spring-long-shirts.jpg_Q90.jpg_.webp",
  },
  {
    name: "Jeans",
    category: "Fashion",
    description: "25% off",
    image:
      "https://cdn.shopify.com/s/files/1/0253/9628/1399/products/Jeans-Men-Skinny-Stretch-Denim-Pants-Distressed-Ripped-Freyed-Slim-Fit-Jeans-Pencil-Pants-Trousers-Free.jpg_640x640_8f58aa0b-de3b-47b5-a92b-8b1cea875be8.jpg?v=1624030684",
  },
  {
    name: "T-Shirts",
    category: "Fashion",
    description: "50% off",
    image:
      "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/1700944/2019/6/8/972c9498-3a37-4d5d-976c-4493b4d5c0021559989322793-HRX-by-Hrithik-Roshan-Men-Yellow-Printed-Round-Neck-T-Shirt--1.jpg",
  },
  {
    name: "Kids",
    category: "Fashion",
    description: "30% off",
    image:
      "https://i.pinimg.com/originals/7d/d1/25/7dd12598b8a4f6bec2a989d9e38d1f92.jpg",
  },
  {
    name: "Kurtas",
    category: "Fashion",
    description: "25% off",
    image:
      "https://stylesatlife.com/wp-content/uploads/2020/11/Cotton-Kurta-for-Men-with-Salwar.jpg.webp",
  },
  {
    name: "Suits",
    category: "Fashion",
    description: "60% off",
    image:
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwc3VpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
];

//middleware for checking
function loginCheck(req, res, next) {
  if (req.session.login) {
    next();
  } else {
    res.redirect('/');
  }
}


/* GET login page. */
router.get('/', function (req, res) {
  if (req.session.login) {
    res.redirect('/home');
  } else {
    if (req.session.attempt) {
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render("index", { error: "Invalid User", layout: null });
      req.session.attempt = false;
    } else {//to clear the cache when logged out
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render('index', { layout: null });
    }

  }

});

router.get('/home', loginCheck, (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.render('home', { products });

})

router.post("/signup",(req, res) => {
  userHelper.signupUser(req.body).then((data) => {
    if (data) {
      req.session.login = true;
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.redirect('/home');
    } else {
      //req.session.attempt = true;
      res.redirect('/');
    }



  })

})
router.get('/home', loginCheck, (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.render('home', { products });

})
router.post("/login", (req, res) => {
  userHelper.userLoginData(req.body).then((response) => {
    if (response) {
      req.session.login = true;
      res.redirect('/home')
    } else {
      req.session.attempt = true;
      res.redirect('/')
    }

  })

  // MongoClient.connect('mongodb://localhost:27017',(err,client) =>{
  //   if(err)
  //   console.log("error");
  //  client.db('data').collection('user').insertOne(req.body);
  // })
})
router.get("/signup", (req, res) => {
  if(req.session.login){
    res.redirect('/home')
  }else{
    res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
    res.render('sign_up', { layout: null });
  }
  
})


router.get('/logout', (req, res) => {
  console.log("itsworking");
  delete req.session.login;
  res.redirect('/');
})

module.exports = router;

