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
  try {
    await Content.deleteMany({
      _id: contentId,
      userId: req.userId,
    });

    res.status(200).json({
      message: "content deleted succesfully.",
    });
  } catch (error) {
    res.status(403).json({
      message: "trying to delete a doc you don't own.",
    });
  }
};

export { addDocument, getAllDocuments, deleteDocument };
