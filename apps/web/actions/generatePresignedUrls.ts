"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  awsAccessKeyId,
  awsRegion,
  awsS3BucketName,
  awsSecretAccessKey,
} from "../config";
import { FileSchema, fileSchema } from "@repo/common/config";
import { nanoid } from "nanoid";
import prisma from "@repo/db/client";
import {
  ActionError,
  ActionSuccess,
  GenerateUploadPresignedUrlResponse,
  GetDocumentPresignedUrlResponse,
} from "../types/global";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId!,
    secretAccessKey: awsSecretAccessKey!,
  },
});

export async function generateUploadPresignedUrl(
  input: FileSchema
): Promise<GenerateUploadPresignedUrlResponse> {
  try {
    const parsedData = fileSchema.parse(input);

    const key = `uploads/${Date.now()}-${nanoid()}}`;

    const command = new PutObjectCommand({
      Bucket: awsS3BucketName!,
      Key: key,
      ContentType: parsedData.fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return {success: true, uploadUrl: url, key };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error while generating upload presigned url.",
    };
  }
}

export async function getDocumentPresignedUrl(
  docId: string
): Promise<GetDocumentPresignedUrlResponse | ActionError> {
  try {
    const doc = await prisma.content.findUnique({
      where: {
        id: docId,
      },
      include: {
        document: {
          select: {
            filePath: true,
          },
        },
      },
    });

    if (!doc) {
      throw new Error("Document not found");
    }

    const command = new GetObjectCommand({
      Bucket: awsS3BucketName,
      Key: doc.document?.filePath,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 500 });

    return { url };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error while creating get document presigned url.",
    };
  }
}

export async function deleteDocumentFromS3(
  key: string
): Promise<ActionSuccess | ActionError> {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: awsS3BucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return { success: true, message: "deleted from s3 successfully." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error while deleting document from s3.",
    };
  }
}
