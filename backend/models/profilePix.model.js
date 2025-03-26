import mongoose from "mongoose";

const profilePixSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  size: {
    type: Number,
    require: true,
  },
  profilePhoto: {
    type: String,
    require: true,
  },
});

const ProfilePix = mongoose.model("ProfilePix", profilePixSchema);

export { ProfilePix };
