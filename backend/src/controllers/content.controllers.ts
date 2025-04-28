import { RequestHandler } from "express";
import { Content } from "../models/content.models.js";

const addDocument: RequestHandler = async (req, res) => {
  const { link, type, title } = req.body;

  await Content.create({
    link,
    type,
    title,
    tags: [],
    userId: req.userId,
  });

  res.json({
    message: "Content added.",
  });
};

const getAllDocuments: RequestHandler = async (req, res) => {
  const userId = req.userId;

  const content = await Content.find({ userId: userId }).populate(
    "userId",
    "username"
  );

  res.json({
    content,
  });
};

const deleteDocument: RequestHandler = async (req, res) => {
  const { contentId } = req.body;
  await Content.deleteMany({
    _id: contentId,
    userId: req.userId,
  });

  res.json({
    message: "content deleted succesfully.",
  });
};

export { addDocument, getAllDocuments, deleteDocument };
