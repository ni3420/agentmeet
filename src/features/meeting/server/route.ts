import { db } from "@/db";
import { meeting } from "@/db/schema";
import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createMeetingSchema, updateMeetingSchema } from "../schema/schema";
import { streamVideo } from "@/lib/stream-video";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(meeting);
    return c.json({ status: 200, data });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const [row] = await db.select().from(meeting).where(eq(meeting.id, id));

    if (!row) {
      return c.json({ status: 404, error: "Meeting workspace log not found" }, 404);
    }
    return c.json({ status: 200, data: row });
  })
  .post("/", zValidator("json", createMeetingSchema), async (c) => {
    const body = c.req.valid("json");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const [newMeeting] = await db
      .insert(meeting)
      .values({
        userId: session.session.userId,
        name: body.name,
        agentId: body.agentId,
        instructions: body.instructions,
        status: "upcoming",
      })
      .returning();

    try {
      const call = streamVideo.video.call("default", newMeeting.id);
      await call.create({
        data: {
          created_by_id: session.session.userId,
          custom: {
            meetingId: newMeeting.id,
            meetingName: newMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on"
            },
            recording: {
              mode: "auto-on",
              quality: "1080p"
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
    }

    return c.json({ status: 201, data: newMeeting }, 201);
  })
  .post("/:id/token", async (c) => {
    const id = c.req.param("id");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const [row] = await db.select().from(meeting).where(eq(meeting.id, id));
    if (!row) {
      return c.json({ status: 404, error: "Meeting workspace target missing" }, 404);
    }

    await streamVideo.upsertUsers([
      {
        id: session.session.userId,
        name: session.user.name || "Participant",
        role: "admin",
      }
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    const token = streamVideo.generateUserToken({
      user_id: session.session.userId,
      validityInSeconds: expirationTime
    });

    return c.json({
      status: 200,
      apiKey: process.env.STREAM_VIDEO_API_KEY || "",
      userId: session.session.userId,
      userName: session.user.name || "Participant",
      token,
    });
  })
  .patch("/:id", zValidator("json", updateMeetingSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const updatePayload: Record<string, unknown> = { ...body, updatedAt: new Date() };
    if (body.startedAt) updatePayload.startedAt = new Date(body.startedAt);
    if (body.endedAt) updatePayload.endedAt = new Date(body.endedAt);

    const [updatedMeeting] = await db
      .update(meeting)
      .set(updatePayload)
      .where(
        and(
          eq(meeting.id, id), 
          eq(meeting.userId, session.session.userId)
        )
      )
      .returning();

    if (!updatedMeeting) {
      return c.json({ status: 404, error: "Meeting record missing or write access denied" }, 404);
    }

    return c.json({ status: 200, data: updatedMeeting });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const [deletedRow] = await db
      .delete(meeting)
      .where(
        and(
          eq(meeting.id, id), 
          eq(meeting.userId, session.session.userId)
        )
      )
      .returning();

    if (!deletedRow) {
      return c.json({ status: 404, error: "Meeting record missing or permission denied" }, 404);
    }

    return c.json({ status: 200, message: "Meeting session destroyed cleanly" });
  })
  .post("/:meetingId/agent", async (c) => {
    const meetingId = c.req.param("meetingId");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const [meetingData] = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, meetingId));

    if (!meetingData) {
      return c.json({ status: 404, error: "Meeting targets missing" }, 404);
    }

    const agentId = `ai-agent-${meetingId.slice(0, 6)}`;
    const agentName = "Gemini AI Node";

    try {
      await streamVideo.upsertUsers([
        {
          id: agentId,
          name: agentName,
          role: "admin",
        }
      ]);

      const call = streamVideo.video.call("default", meetingId);

      await call.getOrCreate({
        data: {
          members: [{ user_id: agentId, role: "admin" }]
        }
      });

      console.log("meetingData fetched safely via Drizzle:", meetingData);

      return c.json({
        status: 200,
        message: "AI Agent injected successfully into meeting stream room",
        data: meetingData,
      });
    } catch (err) {
      console.error("Stream Injection Error:", err);
      return c.json({ status: 500, error: "WebRTC Signaling Injector Failure" }, 500);
    }
  });

export default app;