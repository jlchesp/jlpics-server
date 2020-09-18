import { Router, Response } from 'express';
import { FileUpload } from '../interfaces/file-upload';
import { verifyToken } from '../middlewares/auth';
import { Post } from '../models/post.model';

const postRoutes = Router();

// Get service to get all paginated posts
postRoutes.get('/', async (req: any, res: Response) => {

    let page = Number(req.query.page) || 1;

    let skip = page - 1;
    skip = skip * 10;

    const posts = await Post.find()
        .sort({ _id: -1 }) // Post sorted by most recent
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();

    res.json({
        ok: true,
        page,
        posts
    });
});

// Post service to create a post
postRoutes.post('/', [verifyToken], (req: any, res: Response) => {

    const body = req.body;
    body.user = req.user._id; // We assign the user information to the post

    Post.create(body).then(async postDB => {

        // We obtain all the user's information except their password
        await postDB.populate('user', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        });

    }).catch(err => {
        res.json(err)
    });

});

// Post service to upload files
postRoutes.post('/upload', [verifyToken], (req: any, res: Response) => {

    if(!req.files){
        return res.status(400).json({
            ok: false,
            message: 'No file was uploaded'
        });
    }

    const file: FileUpload = req.files.image;

    if(!file){
        return res.status(400).json({
            ok: false,
            message: 'No file was uploaded - image'
        });
    }

    if(!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            message: 'The file is not an image'
        });
    }

    res.json({
        ok: true,
        file: file.mimetype
    });

});











export default postRoutes;