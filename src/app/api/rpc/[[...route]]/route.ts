import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import agentRouter from "@/features/agents/server/route"
import meetingRouter from "@/features/meeting/server/route"
import CallRouter from "@/features/call/server/route"

const app = new Hono().basePath('/api/rpc')

.route("/agents",agentRouter)
.route("/meeting",meetingRouter)
.route("/call",CallRouter)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType=typeof app