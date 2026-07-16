"use client"

import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

const Page = () => {
  useEffect(()=>{
const init=async()=>{
  const session=await authClient.getSession()
  console.log(session)
}   
init() 
  },[])



  return ( <>
  Home
  </> );
}
 
export default Page;