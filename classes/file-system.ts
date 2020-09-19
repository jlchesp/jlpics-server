import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() { };

    // Function to save the image temporarily
    saveImageTemporarily(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            // Create folders
            const path = this.createUserFolder(userId);

            // File name
            const fileName = this.generateUniqueName(file.name);

            // Move the Temp file to our folder
            file.mv(`${path}/${fileName}`, (err: any) => {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            });

        });
    }

    // Function for creating image storage folders
    private createUserFolder(userId: string) {

        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        const exits = fs.existsSync(pathUser);

        if (!exits) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    // Function to give a unique name to each image
    private generateUniqueName(originalName: string) {

        const nameArr = originalName.split('.');
        const ext = nameArr[nameArr.length - 1];
        const uniqueId = uniqid();

        return `${uniqueId}.${ext}`;

    }

    // Function to change directory image
    tempImagesToPost(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }

        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const tempImages = this.getImagesInTemp(userId);

        tempImages.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`)
        });

        return tempImages;
    }

    // Function to get the images in the temp folder
    private getImagesInTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }

    // Function to obtain and display an image via url
    getPhotoUrl(userId: string, img: string) {
        const pathPhoto = path.resolve(__dirname, '../uploads/', userId, 'posts', img);

        const exits = fs.existsSync(pathPhoto);
        if (!exits) {
            return path.resolve(__dirname, '../assets/400x250.jpg');
        }

        return pathPhoto;
    }

}