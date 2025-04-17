import { model, Schema } from "mongoose";

const contentSchema = new Schema({}, {});

export const Content = model("Content", contentSchema);
