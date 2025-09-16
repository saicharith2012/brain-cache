"use server";
import { addIngestionJob, IngestionJobPayload } from "../lib/utils/queue";

export async function startIngestion(memoryData: IngestionJobPayload) {
    await addIngestionJob(memoryData)
}