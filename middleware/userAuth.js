import jwt from 'jsonwebtoken';

export const auth =async(req,res,next)=>{
    const { token } = req.cookies;
  
      if (!token) {
          return res.json({ success: false, message: "Not Authorised.Login Again" })
      }
      try {
          const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        //   console.log(tokenDecode)
  
          if(tokenDecode.id){
              req.body.userId=tokenDecode.id
          }else{
              return res.json({ success: false, message: 'Not Authorized.Login Again' });
          }
  
          next();
  
      } catch (error) {
          return res.json({ success: false, message: error.message });
      }
  }


export const admin = (req, res, next) => {
    const { token } = req.cookies;
    console.log(req.cookies)
    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
      if (tokenDecode.role === 'admin') {
        next();
      } else {
        return res.status(403).json({
          message: `You don't have an admin access`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  };

  export const requireSignIn= async(req,res,next)=>{
    try {
      const decode =jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      )
      next()
    } catch (error) {
      console.log(error)
    }
  }

// export const adminMiddleware=(req,res,next)=>{
//     if(req.user.role != 'admin'){
//         return res.status(400).json({
//             message:'Access Denied!!'
//         })
//     }
//     next()
// }