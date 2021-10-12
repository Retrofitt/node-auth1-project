const router = require('express').Router()
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')
const {checkUsernameFree, checkUsernameExists, checkPasswordLength,} = require('./auth-middleware')

  router.post('/register', checkPasswordLength, checkUsernameFree, (req, res, next)=>{
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, 8)
    Users.add({username, password: hash})
      .then(newUser =>{
        res.status(201).json(newUser)
      })
      .catch(next)
  })

router.post('/login', checkUsernameExists, (req, res, next)=>{
  const {password} = req.body
  if(bcrypt.compareSync(password, req.user.password)){
    req.session.user = req.user
    res.status(200).json({message: `Welcome ${req.user.username}`})
  }else{
    next({ 
      message: "Invalid credentials",
      status: 401
    })
  }
})

  router.get('/logout', (req, res, next)=>{
    if(req.session.user){
      req.session.destroy(err=>{
        if (err){
          next(err)
        }else{
          res.status(200).json({ message: "logged out"})
        }
      })
    }else{
      next({ 
        message: "no session",
        status: 200
      })
    }
  })

module.exports = router
