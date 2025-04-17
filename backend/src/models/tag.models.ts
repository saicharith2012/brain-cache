import { model, Schema } from "mongoose";

const tagSchema = new Schema({}, {});

export const Tag = model("Tag", tagSchema);
