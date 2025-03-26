import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
      require: true,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Image = mongoose.model("Image", imageSchema);

export { Image };
