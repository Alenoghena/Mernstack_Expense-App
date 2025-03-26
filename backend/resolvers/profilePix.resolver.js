import { ProfilePix } from "../models/profilePix.model.js";
import { writeFile } from "fs/promises";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
// import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import fs from "fs";
import path from "path";
import { finished } from "stream";
import Image from "../imageUpload.js";
// import multer from "multer";
const __dirname = path.resolve();
const fsPromises = fs.promises;

const profilePixResolver = {
  Query: {
    // single photo
    pix: async (_, __, context) => {
      try {
        const { _id } = await context.getUser();
        const photo = await ProfilePix.findOne({ userId: _id }); //args.transactionId

        return photo;
      } catch (err) {
        throw new Error("error getting profilePix", err.message);
      }
    },
  },

  // Upload: GraphQLUpload,

  Mutation: {
    createProfilePix: async (_, { file }, context) => {
      try {
        console.log("start here....");
        const { profilePhoto } = await file;
        const { _id } = await context.getUser();

        const newPhoto = new ProfilePix({
          profilePhoto,
          userId: _id,
        });

        console.log("start next here....");
        Image(file);
        // const buffer = Buffer.from(await file.arrayBuffer());

        // console.log("start next here2....");

        console.log("start next right here....", pathName);
        // await newPhoto.save();

        // return newPhoto;
      } catch (err) {
        throw new Error("error creating profilePix", err.message);
      }
    },

    updateProfilePix: async (_, { file }) => {
      try {
        const fileData = await file;
        // const stream = createReadStream();
        // const pathName = path.join(__dirname, `/public/images/${profilePhoto}`);
        // await stream.pipe(fs.createWriteStream(pathName));

        // input.url = `http://localhost:4000/images/${profilePhoto}`;
        console.log("fileData", fileData.photoId);
        const updatedProfilePix = await ProfilePix.findByIdAndUpdate(
          fileData.photoId,
          fileData,
          { new: true }
        );
        console.log("Update...", updatedProfilePix);
        if (updatedProfilePix?.profilePhoto) {
          fsPromises.rm(
            path.join("public", "images", updatedProfilePix.profilePhoto)
          );
        }
        console.log("update??");
        const buffer = Buffer.from(fileData.arrayBuffer());
        const filename =
          Date.now() + fileData.profilePhoto.replaceAll(" ", "_");
        const pathName = path.join(__dirname, `/public/images/${filename}`);

        console.log("update???");
        // Create a write stream to save the file
        fs.createWriteStream(pathName, buffer);
        console.log("Updated Photo...", updatedProfilePix);

        return updatedProfilePix;
      } catch (err) {
        throw new Error("error updating profilePix");
      }
    },
    deleteProfilePix: async (_, { photoId }) => {
      try {
        const deletedProfilePix = await ProfilePix.findByIdAndDelete({
          _id: photoId,
        });

        return deletedProfilePix;
      } catch (err) {
        throw new Error("error deleting profilePix");
      }
    },
  },
};

export default profilePixResolver;

// const filePath = path.join(__dirname, pathName);
// // Pipe the read stream to the write stream
// createReadStream().pipe(writeStream);
// stream.on("open", () => context.req.pipe(stream));
/////////////////////////////////////
// const buffer = Buffer.from(await file.arrayBuffer());
// const filename = Date.now() + file.profilePhoto.replaceAll(" ", "_");
// await writeFile(path.join("public", "images", filename), buffer);
// from tutorial
//     uploadFile: async (parent, {file})=>{
// const {createReadStream, filename, mimetype, encoding}= await file;
// const stream = createReadStream();
// const pathName = path.join(__dirname, `/public/images/${filename}`);
// await stream.pipe(fs.createWriteStream(pathName));
// return {
//   url:`http://localhost:4000/images/${filename}`
// }

//     },

// const buffer = Buffer.from(fileData.arrayBuffer());

// const filename =
//   Date.now() + fileData.profilePhoto.replaceAll(" ", "_");
// const pathName = path.join(
//   __dirname,
//   `/public/images/${fileData.profilePhoto}`
// );
// console.log("start here3....", newPhoto, pathName);
// // Create a write stream to save the file
// fs.createWriteStream(pathName);

// console.log("newPhoto here...", newPhoto, pathName);

// console.log("Next here...", _id);
