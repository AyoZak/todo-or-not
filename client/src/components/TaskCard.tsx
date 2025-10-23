import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Save, Edit3 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EnhanceDropdown, { type EnhancementType } from "./EnhanceDropdown";
import TimeTracker from "./TimeTracker";
import { type TaskColor } from "./ColorPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskDetailsDialog from "./TaskDetailsDialog";

export interface Task {
  id: string;
  title: string;
  details: string;
  originalText?: string;
  color: TaskColor;
  timeSpent: number;
  isRunning: boolean;
  isFinished: boolean;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
  onEnhance: (type: EnhancementType) => void;
  isEnhancing?: boolean;
}

export default function TaskCard({ task, onUpdate, onDelete, onEnhance, isEnhancing }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(!task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colorBorderClass = task.color ? `border-l-4 border-l-task-${task.color}` : "";

  const handleTitleEdit = () => {
    if (task.title) {
      setIsEditingTitle(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-3 bg-card rounded-md border ${colorBorderClass} hover-elevate cursor-pointer flex items-center gap-2`}
        data-testid={`card-task-${task.id}`}
        onClick={() => !isEditingTitle && setIsOpen(true)}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          data-testid="button-drag-task"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium text-sm truncate flex-1"
              data-testid="text-task-title"
            >
              {task.title || "Untitled Task"}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <EnhanceDropdown onEnhance={onEnhance} isEnhancing={isEnhancing} />
            </div>
          </div>
        </div>
      </div>

      <TaskDetailsDialog
        task={task}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEnhance={onEnhance}
        isEnhancing={isEnhancing}
      />
    </>
  );
}
