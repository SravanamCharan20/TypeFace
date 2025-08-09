import jwt from 'jsonwebtoken'

const JWT_SECRET = "$uperm@n"; 

const AutenticateUser = async(req,res,next) =>{
    try {
        const token = req.cookies["access_token"];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({message : "Unauthorized Access"});
    }
}


const AuthorizeUser = (permittedRoles=[]) =>{
    return function (req, res, next){
        try {
            if (permittedRoles.includes(req.user.role)){
                return next();
            }
            else {
                return res.status(401).json({message : "Unauthorized Access"});
            }
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({message : "Unauthorized Access"});
        }
    }
}


export {AutenticateUser, AuthorizeUser}