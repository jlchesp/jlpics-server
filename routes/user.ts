import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const userRoutes = Router();

//Login
userRoutes.post('/login', ( req: Request, res: Response) => {

    const body = req.body;

    User.findOne({ email: body.email}, ( err, userDB) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if (userDB.comparePassword( body.password )){
            res.json({
                ok: true,
                token: 'kggjklghglgk'
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos **'
            });
        }
    })
});


//Create user
userRoutes.post('/create', ( req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) // Contraseña encriptada con bcrypt
    };

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