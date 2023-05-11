

const authCheck= (req,res,next)=>{
  if (!req.user){
      //if user is not logged in 
      res.redirect('/auth/login');
  }else{
      next()
  }
};

module.exports = authCheck;
