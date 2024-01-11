import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()
const pool = mysql.createPool({
    host: process.env.DEV_HOST,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    connectionLimit: 10

})

export const connection = {
    query: async (query, params) =>{
        return pool.query(query,params)
    }
}