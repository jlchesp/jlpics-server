import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/auth';

const userRoutes = Router();

// Post service for user authentication
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;

    // Function to find a user by email
    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) throw err;

        // If there is no user in the DB, it gives us a negative answer with an error message
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'The username or password is not correct'
            });
        }

        // If the user exists in the DB and his password is correct, he returns a positive response and provides him with a token
        if (userDB.comparePassword(body.password)) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
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
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) // Password encrypted with bcrypt
    };

    // Function to create a user
    User.create(user).then(userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });

});

userRoutes.post('/update', verifyToken, (req: any, res: Response) => {

    const user = {
        name: req.body.name || req.user.name,
        avatar: req.body.avatar || req.user.avatar,
        email: req.body.email || req.user.email
    };

    User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                message: 'There is no user with that id'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });

});

export default userRoutes;
