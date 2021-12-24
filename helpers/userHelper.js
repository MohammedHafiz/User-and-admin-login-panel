const { resolve, reject } = require('promise');
var db = require('../config/connection');
var objectId = require('mongodb').ObjectId

module.exports ={

    signupUser:(userData)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection('user').insertOne(userData).then((data) =>{
                resolve(data)
            })

        })
    },
 
    addUser:(userData,callback) =>{
       // return new Promise ((resolve,reject)=>{
           // console.log(userData);
             db.get().collection('user').insertOne(userData).then((data) =>{
               // db.get().collection('user').findOne(data.insertedId).then((user)=>{
                callback(data);      
            })

         
        }  ,
        getAllUsers:()=>{
            return new Promise (async(resolve,reject) =>{
                let allUsers = await db.get().collection('user').find().toArray();
                resolve(allUsers)
            })
        },
        userLoginData:(userData) =>{
            return new Promise(async (resolve,reject) =>{
                let loginStatus = false;
                let user = await db.get().collection('user').findOne({Email : userData.Email})
                if(user){
                    if(user.Password == userData.Password){
                        loginStatus=true
                        resolve(loginStatus)
                    }else{
                        loginStatus=false;
                        resolve(loginStatus)
                        }                   


                }else{
                    loginStatus=false
                    resolve(loginStatus)
                }
            })
        },
        deleteUser:(userId) =>{
            return new Promise ((resolve,reject)=>{
                db.get().collection('user').deleteOne({_id:objectId(userId)})
                resolve()
            })
        },
        getUserDetails:(userId) =>{
            return new Promise((resolve,reject) =>{
                db.get().collection('user').findOne({_id:objectId(userId)}).then((user)=>{
                    resolve(user);
                })
            })
        },
        updateUserDetails:(userId,userDetails)=>{
            return new Promise((resolve,reject) =>{
                db.get().collection('user').updateOne({_id:objectId(userId)},{
                    $set:{
                        Username:userDetails.Username,
                        Email:userDetails.Email
                    }
                }).then((response) =>{
                    resolve();
                    
                })
                
            })

        }
}