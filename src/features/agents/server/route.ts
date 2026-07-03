import { db } from "@/db";
import { agents } from "@/db/schema";
import { Hono } from "hono";
import { auth } from "@/lib/auth"; 
import { eq, and } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(agents);
    return c.json({
      status: 200,
      data: data,
    });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, id));

    if (!agent) {
      return c.json({
        status: 404,
        error: "Agent not found",
      }, 404);
    }

    return c.json({
      status: 200,
      data: agent,
    });
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    console.log("body",body)
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.session?.userId) {
      return c.json({ 
        status: 401, 
        error: "Unauthorized: Active session signature missing" 
      }, 401);
    }

    const [newAgent] = await db.insert(agents).values({
      userId: session.session.userId,
      ...body,
    }).returning(); 

    return c.json({
      status: 200,
      data: newAgent,
    });
  })
  .patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    // Update only if the agent exists AND belongs to the logged-in user
    const [updatedAgent] = await db
      .update(agents)
      .set({
        ...body,
        updatedAt: new Date(), // Standard security practice to record mutations
      })
      .where(
        and(
          eq(agents.id, id),
          eq(agents.userId, session.session.userId)
        )
      )
      .returning();

    if (!updatedAgent) {
      return c.json({ 
        status: 404, 
        error: "Agent not found or write access denied" 
      }, 404);
    }

    return c.json({
      status: 200,
      data: updatedAgent,
    });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.session?.userId) {
      return c.json({ status: 401, error: "Unauthorized" }, 401);
    }

    // Delete only if the agent belongs to the logged-in user
    const [deletedAgent] = await db
      .delete(agents)
      .where(
        and(
          eq(agents.id, id),
          eq(agents.userId, session.session.userId)
        )
      )
      .returning();

    if (!deletedAgent) {
      return c.json({ 
        status: 404, 
        error: "Agent not found or permission denied" 
      }, 404);
    }

    return c.json({
      status: 200,
      message: "Agent deployment cleanly destroyed",
    });
  });

export default app;