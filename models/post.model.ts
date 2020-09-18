import { Schema, Document, model } from 'mongoose';

// Post model class, defining what type is each attribute that composes it
const postSchema = new Schema({

    created: {
        type: Date
    },
    message: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});

// Function to receive the current date when creating a post
postSchema.pre<IPost>('save', function(next){
    this.created = new Date();
    next();
});

// Creation of the post interface with its attributes and functions
interface IPost extends Document {
    created: Date;
    message: string;
    img: string[];
    coords: string;
    user: string;
}

export const Post = model<IPost>('Post', postSchema);