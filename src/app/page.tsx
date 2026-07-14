"use client"

import { useGemini } from "@/features/call/api/use-gemini";
import { useEffect } from "react";

const Page = () => {
const {data,mutate}=useGemini()
useEffect(()=>{
mutate({
  id:"hc3gnKvn32ZoAqhIbnqam"
})
},[mutate])
  return ( <>
  Home
  <p>{JSON.stringify(data)}</p>
  </> );
}
 
export default Page;