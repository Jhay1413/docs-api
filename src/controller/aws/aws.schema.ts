import { z } from "zod";

const getViewSignedUrlsSchema = z.object({
  id: z.string(),
  signedUrl: z.string().optional(),
  fileUrl: z.string(),
});

export { getViewSignedUrlsSchema };
