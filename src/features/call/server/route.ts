import { db } from "@/db";
import { meeting } from "@/db/schema";
import { auth } from "@/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const streamApiKey = process.env.STREAM_VIDEO_API_KEY!;
const streamApiSecret = process.env.STREAM_VIDEO_SECRET_KEY!;



const streamClient = new StreamClient(
  streamApiKey,
  streamApiSecret
);

const app = new Hono()

.post("/:callType/:callId/connect", async (c) => {
  try {
    const { callType, callId } = c.req.param();

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.session?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [row] = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, callId));

    if (!row) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    const token = streamClient.generateUserToken({
      user_id: "ai-bot",
    });

    return c.json({
      success: true,
      callType,
      callId,
      apiKey: streamApiKey,
      token,
      user: {
        id: "ai-bot",
        name: "Gemini Assistant",
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default app;