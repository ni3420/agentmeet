import { db } from "@/db";
import { agents } from "@/db/schema";
import { Hono } from "hono";

const app=new Hono()
.get("/",async(c)=>{
  console.log("hitting point")
    const data={
      name:"nitin"
    }
    return c.json({
        status:"200",
        data:data
    })
})


export default app