const asyncHandler =(requesthandler)=>{ //requesthadnler is function
    return (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((err)=>next(err))
    }

}

export {asyncHandler}



