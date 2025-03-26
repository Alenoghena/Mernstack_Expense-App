// import { Image } from "../models/image.model.js";
// // import { writeFile } from "fs/promises";
// import path from "path";
// import { createWriteStream } from "fs";
// import { graphqlUploadExpress } from "graphql-upload";

// const storeUpload = async ({ stream, filename }) => {
//   //   const uploadDir = "./uploads";

//   return new Promise((resolve, reject) =>
//     stream
//       .pipe(
//         createWriteStream(path.join(__dirname, "public", "image", filename))
//       )
//       .on("finish", () =>
//         resolve({ path: path.join(__dirname, "public", "image", filename) })
//       )
//       .on("error", reject)
//   );
// };

// const processUpload = async (upload) => {
//   const { createReadStream, filename, mimetype, size } = await upload;
//   const stream = createReadStream();
//   const { path } = await storeUpload({ stream, filename });
//   return { filename, mimetype, size, path };
// };

// const imageResolver = {
//   upload: graphqlUploadExpress().single("file"),
//   Query: {
//     // single photo
//     file: async (_, __, context) => {
//       try {
//         const { _id } = await context.getUser();
//         const photo = await Image.find({ userId: _id }); //args.transactionId
//         console.log("photo........", photo);
//         return photo;
//       } catch (err) {
//         throw new Error("error getting profilePix", err.message);
//       }
//     },
//   },

//   Mutation: {
//     createImage: async (_, { file }, context) => {
//       try {
//         const result = await processUpload(file);
//         //   const newFile = await File.create(result);

//         // console.log("formdata...", input.formData);
//         const { _id } = await context.getUser();
//         const newPhoto = new Image({
//           ...result,
//           userId: _id,
//         });

//         await newPhoto.save();

//         return newPhoto;
//       } catch (err) {
//         throw new Error("error creating profilePix", err.message);
//       }
//     },

//     updateImage: async (_, { input }) => {
//       try {
//         const updatedProfilePix = await Image.findByIdAndUpdate(
//           input.photoId,
//           input,
//           { new: true }
//         );

//         return updatedProfilePix;
//       } catch (err) {
//         throw new Error("error updating profilePix");
//       }
//     },
//     deleteImage: async (_, { photoId }) => {
//       try {
//         const deletedProfilePix = await Image.findByIdAndDelete({
//           _id: photoId,
//         });

//         return deletedProfilePix;
//       } catch (err) {
//         throw new Error("error deleting profilePix");
//       }
//     },
//   },
// };

// export default imageResolver;
