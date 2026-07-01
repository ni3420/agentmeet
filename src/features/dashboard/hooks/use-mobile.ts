import {atom,useAtom} from "jotai"

const openSideBar=atom(true)

export const useMobile=()=>{
    return useAtom(openSideBar)
}