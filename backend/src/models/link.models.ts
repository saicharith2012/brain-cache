import { model, Schema } from "mongoose";

const linkSchema = new Schema({}, {});

export const Link = model("Link", linkSchema);
