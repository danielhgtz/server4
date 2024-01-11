import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { authUser, createUsers, deleteUser, getUsers, updateUser } from "./controllers/users.js"
import { authToken } from "./utils/jwt.js"

export class App {

    app

    constructor(){
        this.app = express()
        this.setting()
        this.middlewares()
        this.routes()
    }

    setting(){
        dotenv.config()
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json());

    }

    routes(){
        this.app.post("/create",createUsers)
        this.app.get("/users",authToken, getUsers)
        this.app.delete("/users",deleteUser)
        this.app.put("/users", updateUser)
        this.app.post("/auth", authUser)
    }

    listen(){
        this.app.listen(process.env.PORT,()=>{
            console.log(`Server running on port ${process.env.PORT}`)
        })
    }
}