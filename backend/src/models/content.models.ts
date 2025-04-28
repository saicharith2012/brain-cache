import mongoose from "mongoose";
import { model, Schema } from "mongoose";
import { User } from "./user.models.js";

const contentTypes = ["document", "tweet", "youtube", "link"];

const contentSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: contentTypes,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// using pre-save hook to check whether the user exists.
contentSchema.pre("save", async function (next) {
  const user = await User.findById(this.userId);
  if (!user) {
    throw new Error("User does not exist.");
  }
  next();
});

export const Content = model("Content", contentSchema);
