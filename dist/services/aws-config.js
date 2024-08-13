"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrlFromS3 = exports.getUploadSignedUrlFromS3 = exports.uploadToS3 = exports.uploadImageToS3 = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const utils_1 = require("../utils/utils");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config = {
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_PRIVATE_KEY,
    },
};
exports.s3 = new client_s3_1.S3Client(config);
const uploadImageToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = "envicomm";
        const folder = "image";
        const generatedName = (0, utils_1.generateFileName)();
        const key = `${company}/${folder}/${generatedName}`;
        yield exports.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                "Content-Disposition": "inline",
            },
        }));
        return key;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error uploading image to S3");
    }
});
exports.uploadImageToS3 = uploadImageToS3;
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = "envicomm";
        const generatedName = (0, utils_1.generateFileName)();
        const key = `${company}/${generatedName}`;
        yield exports.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                "Content-Disposition": "inline",
            },
        }));
        return { fileUrl: key, fileOriginalName: file.originalname };
    }
    catch (error) {
        console.log(error);
        throw new Error("Error uploading file to S3");
    }
});
exports.uploadToS3 = uploadToS3;
const getUploadSignedUrlFromS3 = (company, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generatedFilename = (0, utils_1.generateFileName)();
        const key = `${company}/${fileName}${generatedFilename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Metadata: {
                "Content-Disposition": "inline",
            },
        });
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(exports.s3, command, {
            expiresIn: 3600,
        });
        return { url, key };
    }
    catch (error) {
        console.log(error);
        throw new Error('Error getting signed url from S3');
    }
});
exports.getUploadSignedUrlFromS3 = getUploadSignedUrlFromS3;
const getSignedUrlFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getObjectCommand = new client_s3_1.GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        console.log(getObjectCommand);
        const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(exports.s3, getObjectCommand, {
            expiresIn: 60 * 60,
        });
        return signedURL;
    }
    catch (error) {
        throw new Error('Error getting signed url from S3');
    }
});
exports.getSignedUrlFromS3 = getSignedUrlFromS3;
