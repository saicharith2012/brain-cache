"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  awsAccessKeyId,
  awsRegion,
  awsS3BucketName,
  awsSecretAccessKey,
} from "../config";
import { FileSchema, fileSchema } from "@repo/common/config";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId!,
    secretAccessKey: awsSecretAccessKey!,
  },
});

export async function generatePresignedUrl(input: FileSchema) {
  const parsedData = fileSchema.parse(input);

  const key = `uploads/${Date.now()}-${nanoid()}}`;

  const command = new PutObjectCommand({
    Bucket: awsS3BucketName!,
    Key: key,
    ContentType: parsedData.fileType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return { uploadUrl: url, key };
}
