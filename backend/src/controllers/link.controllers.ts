import { RequestHandler } from "express";
import { Link } from "../models/link.models.js";
import random from "../utils/random.js";
import { Content } from "../models/content.models.js";
import { User } from "../models/user.models.js";

const createLink: RequestHandler = async (req, res) => {
  const share = req.body.share;
  // check if the link for the user brain cache is to be shared, i.e, share is true
  if (share) {
    // If yes, check if there is any existing link corresponding to the user
    const existingLink = await Link.findOne({
      userId: req.userId,
    });

    // If link exists, return it
    if (existingLink) {
      res.json({
        link: existingLink.hash,
      });
      return;
    }

    // else create a new hash using random() util
    const hash: string = random(15);
    // create a new link object in the db
    await Link.create({
      hash,
      userId: req.userId,
    });

    // return the new hash
    res.json({
      link: hash,
    });
  } else {
    // if share is false, remove the link from the db
    await Link.deleteOne({
      userId: req.userId,
    });

    res.json({
      message: "removed link.",
    });
  }
};

const shareLink: RequestHandler = async (req, res) => {
  // fetch the link hash from the url params
  // check if the link exists
  // fetch the content from the db
  // check if the owner of the content exists
  // send response containing owner username and content
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

  const content = await Content.findOne({
    userId: link.userId,
  });

  const user = await User.findById(link.userId);

  if (!user) {
    res.status(404).json({
      message: "user not found.",
    });
    return;
  }

  res.status(200).json({
    username: user.username,
    content,
  });
};

export { createLink, shareLink };
