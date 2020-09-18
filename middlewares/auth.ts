import {Response, Request, NextFunction} from 'express';
import Token from '../classes/token';

// A middleware is a function that we want to execute before a certain function finishes executing
// It is an intermediate step
export const verifyToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';
    
    // We check the user token and make the previous function (in our case, the update user) continue with the 'next ()' function
    Token.checkToken(userToken)
        .then( (decoded: any) => {
            req.user = decoded.user;
            next();
        })
        .catch( err => {
            res.json({
                ok: false,
                message: 'Invalid token'
            });
        });
}
