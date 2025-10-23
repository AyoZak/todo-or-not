import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskDetailsDialog from "../TaskDetailsDialog";
import { type Task } from "../TaskCard";

export default function TaskDetailsDialogExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [task, setTask] = useState<Task>({
    id: "1",
    title: "Fix login bug on mobile",
    details: "Users are reporting issues with the login form on mobile devices. Need to investigate and fix.",
    originalText: "login broke on phone",
    color: "red",
    timeSpent: 1234,
    isRunning: false,
    isFinished: false,
  });

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Task Details</Button>
      <TaskDetailsDialog
        task={task}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpdate={setTask}
        onDelete={() => console.log("Delete task")}
        onEnhance={(type) => console.log("Enhance with type:", type)}
      />
    </div>
  );
}
