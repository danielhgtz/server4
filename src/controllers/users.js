import { connection } from "../config/database.js"
import { compareEncryptedPassword, encryptPassword } from "../utils/encryptPassword.js"
import { generateAccessToken } from "../utils/jwt.js"

export const createUsers = async (req,res) =>{
    try {
   
    const {email, name, password} = req.body

    if(!email && !name && !password){
        return res.status(400).send("Missing values")
    }

    if(!email){
        return res.status(400).send("Missing email value")
    }
    
    if(!name){
        return res.status(400).send ("Missing name value")
    }

    if(!password){
        return res.status(400).send ("Missing password value")
    }
    
    const[registeredUser] = await connection.query('SELECT email FROM users WHERE email = ? LIMIT 1',[email])
    
    if(registeredUser.length){
        return res.status(400).send('Email already registered, please try another one')
    }


    const hashedPassword = await encryptPassword(password)
    

    await connection.query('INSERT INTO users (email,name, password) VALUES (?,?,?)', [email, name, hashedPassword])

    return res.status(200).send({
        message:'USER CREATED SUCCESSFULY',
        user: name,
        token: generateAccessToken(name)
    })


    } catch (error) {
        console.log(error);
        return res.status(500).send("Unexpected server error")
    }
}

export const getUsers = async (req,res) => {
    try {
        const [usersDB] = await connection.query('SELECT id, name, email FROM users')

        return res.status(200).send(usersDB)
        // console.log(usersDB);

    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (req,res) => {
    try {
        const {id} = req.body

        if(!id){
            return res.status(400).send("Mssing id value")
        }

        
        const [userDB] = await connection.query('SELECT names FROM users WHERE id = ?', [id])

        if(!userDB.length){
            return res.status(200).send('User already deleted')
        }else{
            await connection.query('DELETE FROM users WHERE id = ?',[id])
            return res.status(200).send(`User [${id}] deleted succesfully`)
        }
        

    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req,res) => {
    try {
        const{id, names, address} = req.body;
        console.log(req.body);

        if(!id && !names && !address){
            return res.status(400).send('Missing values')
        }

        if(!id){
            return res.status(400).send("Missing id value")
        }

        if(!names){
            return res.status(400).send("Missing names value")
        }

        if(!address){
            return res.status(400).send("Missing address value")
        }

        await connection.query('UPDATE users SET names = ?, address = ? WHERE id = ?', [names, address,id])

        return res.status(200).send(`User [${id}] updated succesfully`)
    } catch (error) {
        console.log(error);
    }
}

export const authUser = async (req, res) => {
    try {
        const{email, password} = req.body

        const [userDB] = await connection.query('SELECT name, password FROM users WHERE email = ? LIMIT 1', [email])
        
        if(!userDB.length){
            return res.status(400).send("Invalid credentials")
        }
        const user = userDB[0]

        const correctPassword = await compareEncryptedPassword(password, user.password)

        if(!correctPassword){
            return res.status(400).send('Invalid credentials')
        }
        
        return res.status(200).send({
            user: user.name,
            token: generateAccessToken(user.name)
        })

    } catch (error) {
        console.log(error);

        return res.status(500).send('Internal Server Error')
    }

}