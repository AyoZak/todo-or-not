import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard, { type Task } from "./TaskCard";
import { formatTime } from "./TimeTracker";
import { type EnhancementType } from "./EnhanceDropdown";

export interface TaskListData {
  id: string;
  title: string;
  tasks: Task[];
}

interface TaskListProps {
  list: TaskListData;
  onUpdate: (list: TaskListData) => void;
  onDelete: () => void;
  onTaskUpdate: (taskId: string, task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: () => void;
  onTaskEnhance: (taskId: string, type: EnhancementType) => void;
  enhancingTaskId?: string;
  dragListeners?: any;
  dragAttributes?: any;
}

export default function TaskList({
  list,
  onUpdate,
  onDelete,
  onTaskUpdate,
  onTaskDelete,
  onTaskAdd,
  onTaskEnhance,
  enhancingTaskId,
  dragListeners,
  dragAttributes,
}: TaskListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id });

  const totalTime = list.tasks.reduce((sum, task) => sum + task.timeSpent, 0);

  return (
    <div className="w-80 flex-shrink-0" data-testid={`list-${list.id}`}>
      <Card className="h-full flex flex-col p-4">
        <div className="flex items-start gap-2 mb-4">
          {dragListeners && dragAttributes && (
            <button
              {...dragAttributes}
              {...dragListeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-1"
              data-testid="button-drag-list"
            >
              <GripVertical className="h-5 w-5" />
            </button>
          )}

          <div className="flex-1 space-y-2">
            {isEditingTitle ? (
              <Input
                value={list.title}
                onChange={(e) => onUpdate({ ...list, title: e.target.value })}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                data-testid="input-list-title"
                className="font-semibold text-lg"
              />
            ) : (
              <h2
                className="font-semibold text-lg cursor-pointer hover:text-primary"
                onClick={() => setIsEditingTitle(true)}
                data-testid="text-list-title"
              >
                {list.title}
              </h2>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{list.tasks.length} tasks</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium" data-testid="text-list-total-time">
                  {formatTime(totalTime)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  data-testid="button-delete-list"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto space-y-3 min-h-[200px]"
        >
          <SortableContext
            items={list.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={(updatedTask) => onTaskUpdate(task.id, updatedTask)}
                onDelete={() => onTaskDelete(task.id)}
                onEnhance={(type) => onTaskEnhance(task.id, type)}
                isEnhancing={enhancingTaskId === task.id}
              />
            ))}
          </SortableContext>
        </div>

        <Button
          onClick={onTaskAdd}
          variant="outline"
          className="mt-4 w-full gap-2"
          data-testid="button-add-task"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </Card>
    </div>
  );
}
