import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import agentRouter from "@/features/agents/server/route"

const app = new Hono().basePath('/api/rpc')

.route("/agents",agentRouter)

export const GET = handle(app)
export const POST = handle(app)

export type AppType=typeof app