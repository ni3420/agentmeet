import { db } from "@/db";
import { agents } from "@/db/schema";
import { Hono } from "hono";
import { auth } from "@/lib/auth"; 

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(agents);
    return c.json({
      status: 200,
      data: data,
    });
  })
  .post("/", async (c) => {
    const body = await c.req.json();

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
  });

export default app;