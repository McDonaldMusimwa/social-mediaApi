const router = require('express').Router();
const authCheck = require('../services/authCheck')



router.get('/',authCheck,(req,res)=>{
    res.send(`you are logged in, this is your profile ${req.user.username}`)
})


module.exports = router