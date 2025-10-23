import { useState } from "react";
import TaskCard, { type Task } from "../TaskCard";
import { DndContext } from "@dnd-kit/core";

export default function TaskCardExample() {
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

  const handleEnhance = (type: string) => {
    console.log("Enhancing with type:", type);
  };

  return (
    <DndContext>
      <div className="p-4 max-w-md">
        <TaskCard
          task={task}
          onUpdate={setTask}
          onDelete={() => console.log("Delete task")}
          onEnhance={handleEnhance}
        />
      </div>
    </DndContext>
  );
}
