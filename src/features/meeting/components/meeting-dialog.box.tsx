"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingForm from "./meeting-form";

export default function MeetingDialogBox() {
  const [open,setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-xs self-start sm:self-auto">
          <Plus className="size-3.5 stroke-[2.5] mr-1.5" />
          New Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>Schedule Assessment Room</DialogTitle>
          <DialogDescription>
            Configure properties to spawn a new real-time AI session instance.
          </DialogDescription>
        </DialogHeader>
        <div className="border-none shadow-none bg-transparent">
          <MeetingForm close={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}