import { Request } from "express";
import multer, { Multer } from "multer";
import path from "path"
import CustomError from "../../helpers/error/CustomError";

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        const rootDir = path.dirname(require.main?.filename as string);
        callback(null, path.join(rootDir, "/public/uploads"))
    },
    filename: function (request, file, callback) {
        const extension: string = file.mimetype.split("/")[1];
        request.savedProfileImage = `image_${request.user.id}.${extension}`;
        callback(null, request.savedProfileImage);
    }
});

const fileFilter = (request: Request, file: any, callback: Function) => {
    let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return callback(new CustomError("Please provide a valid image file",400),false);
    }
    return callback(null,true);
}

const profileImageUpload : Multer = multer({storage,fileFilter});

export default profileImageUpload;