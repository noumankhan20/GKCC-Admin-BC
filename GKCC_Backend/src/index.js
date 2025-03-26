    // require('dotenv').config({path:'./env'})
    import dotenv from "dotenv"
    import connectDB from "./db/index.db.js";
    import {app} from "./app.js"
   

    dotenv.config({
        path:'./env'
    })

    // Use /api prefix for all routes defined in membership.routes.js
    //app.use('/api', membershipRouter);


    connectDB()
    .then(()=>{
        app.on("error",(error)=>{
            console.log("after db connection error:-",err);
            throw error
        });

        app.listen(process.env.port || 8000,()=>{
            console.log(`app is listening at ${process.env.port}`);
        })
    })
    .catch((error)=>{
        console.log("db connection error",error);
    })

