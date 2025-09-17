import dotenv from "dotenv";

dotenv.config();

export const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME
export const awsRegion = process.env.AWS_REGION
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const googleGenaiApiKey = process.env.GOOGLE_API_KEY
export const qdrantUrl = process.env.QDRANT_URL
export const qdrantCollectionName = process.env.QDRANT_COLLECTION_NAME