import app from "./app.js";
import connectionDb from "./config/db/mongo/connection.js";
import { PORT_NO } from "./config/env.js";

const PORT = PORT_NO;
async function runServer(){
    await connectionDb();

    app.listen(PORT, ()=>{
        console.log(`Server running on PORT ${PORT}`)
    })
}

runServer();