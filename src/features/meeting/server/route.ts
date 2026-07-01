import { db } from "@/db";
import { meeting } from "@/db/schema";
import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {createMeetingSchema,updateMeetingSchema} from "../schema/schema"


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

    return c.json({ status: 201, data: newMeeting }, 201);
  })
  .patch("/:id", zValidator("json", updateMeetingSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    const updatePayload: Record<string, any> = { ...body, updatedAt: new Date() };
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
  });

export default app;