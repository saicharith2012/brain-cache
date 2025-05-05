import { RequestHandler } from "express";
import { Link } from "../models/link.models.js";
import random from "../utils/random.js";
import { Content } from "../models/content.models.js";
import { User } from "../models/user.models.js";

const createLink: RequestHandler = async (req, res) => {
  // extract share boolean from request body
  // check if the link is to be shared (share = true)
  // if true, search if a link already exists on this user Id
  // if it exists, send the link hash as response
  // else create a new hash using random util
  // create a new link in the database
  // send response
  // if the share boolean is false, remove the link from the db.
  try {
    const share = req.body.share;

    if (share) {
      const existingLink = await Link.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        res.json({
          link: existingLink.hash,
        });
        return;
      }

      const hash = random(15);

      const link = await Link.create({
        hash,
        userId: req.userId,
      });

      res.json({
        message: `/share/${link.hash}`
      });
    } else {
      await Link.deleteOne({
        userId: req.userId,
      });

      res.json({
        message: "removed link.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error: ${
        error instanceof Error ? error.message : "Internal Server Error"
      } `,
    });
  }
};

const shareLink: RequestHandler = async (req, res) => {
  // fetch the hash from the request url
  // fetch the link document that belongs to the hash from db (throw error if it doesn't exist) and extract userId
  // fetch content documents with the userId from the db
  // fetch the user document and extract username
  // throw error if user does not exist
  // send the response containing contents and username

  try {
    const hash = req.params.shareLink;

    const link = await Link.findOne({
      hash,
    });

    if (!link) {
      res.status(404).json({
        message: "Invalid URL",
      });
      return;
    }

    const content = await Content.find({
      userId: link.userId,
    });

    const user = await User.findById(link.userId);

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    res.status(200).json({
      user: user.username,
      content,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${
        error instanceof Error ? error.message : "Internal Server Error."
      }`,
    });
  }
};

export { createLink, shareLink };
