import {AsyncHandler} from "../utils/Asynchandler.js";


const register= AsyncHandler(async (req, res)=>{

    res.status(200).json({
        message: 'ok'
    })

})

export {
    register
}