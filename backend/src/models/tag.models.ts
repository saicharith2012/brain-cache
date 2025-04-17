import { model, Schema } from "mongoose";

const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

export const Tag = model("Tag", tagSchema);
