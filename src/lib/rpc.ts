import type { AppType } from '@/app/api/rpc/[[...route]]/route'
import { hc } from 'hono/client'

export const client = hc<AppType>('/')