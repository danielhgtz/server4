import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

  export const generateAccessToken = (user) => {

    return jwt.sign(user,process.env.JWT_SECRET)

  }


export const authToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token === null) return res.status(401).send('Missing credentials')

    jwt.verify(token, process.env.JWT_SECRET,(err, user)=>{
       
        if(err) {
            console.log(err);
            return res.status(400).send('Missing credentials')
        }

        req.user = user

        next()
    })
}


