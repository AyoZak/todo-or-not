import { useState } from "react";
import TaskList, { type TaskListData } from "../TaskList";
import { type Task } from "../TaskCard";
import { DndContext } from "@dnd-kit/core";

export default function TaskListExample() {
  const [list, setList] = useState<TaskListData>({
    id: "list-1",
    title: "My Tasks",
    tasks: [
      {
        id: "task-1",
        title: "Review pull request",
        details: "Check the new authentication implementation",
        color: "blue",
        timeSpent: 1800,
        isRunning: false,
        isFinished: false,
      },
      {
        id: "task-2",
        title: "Update documentation",
        details: "Add examples for the new API endpoints",
        color: "green",
        timeSpent: 0,
        isRunning: false,
        isFinished: false,
      },
    ],
  });

  const handleTaskUpdate = (taskId: string, updatedTask: Task) => {
    setList({
      ...list,
      tasks: list.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    });
  };

  const handleTaskDelete = (taskId: string) => {
    setList({
      ...list,
      tasks: list.tasks.filter((t) => t.id !== taskId),
    });
  };

  const handleTaskAdd = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "",
      details: "",
      color: null,
      timeSpent: 0,
      isRunning: false,
      isFinished: false,
    };
    setList({
      ...list,
      tasks: [...list.tasks, newTask],
    });
  };

  return (
    <DndContext>
      <div className="p-4">
        <TaskList
          list={list}
          onUpdate={setList}
          onDelete={() => console.log("Delete list")}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskAdd={handleTaskAdd}
          onTaskEnhance={(taskId, type) => console.log("Enhance", taskId, type)}
        />
      </div>
    </DndContext>
  );
}
