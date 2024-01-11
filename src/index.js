import { App } from "./app.js"
import { connection } from "./config/database.js"


const main = async () =>{
    const app = new App()
    app.listen()

    await connection.query('SELECT 1').then(console.log('Database connencted!'))

}

main()