import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const userRoutes = Router();

// Post service for user authentication
userRoutes.post('/login', ( req: Request, res: Response) => {

    const body = req.body;
    
    // Function to find a user by email
    User.findOne({ email: body.email}, ( err, userDB) => {

        if ( err ) throw err;

        // If there is no user in the DB, it gives us a negative answer with an error message
        if ( !userDB ) {
            return res.json({
                ok: false,
                message: 'The username or password is not correct'
            });
        }
        
        // If the user exists in the DB and his password is correct, he returns a positive response and provides him with a token
        if (userDB.comparePassword( body.password )){
            res.json({
                ok: true,
                token: 'kggjklghglgk'
            });
        } else {
            return res.json({
                ok: false,
                message: 'The username or password is not correct **'
            });
        }
    })
});


// Post service for user creation
userRoutes.post('/create', ( req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) // Password encrypted with bcrypt
    };
    
    // Function to create a user
    User.create( user ).then( userDB => {

        res.json({
            ok: true,
            user: userDB
        });

    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });

});

export default userRoutes;
