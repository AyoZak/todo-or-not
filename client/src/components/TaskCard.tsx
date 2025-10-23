import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Play, Pause, Check, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EnhanceDropdown, { type EnhancementType } from "./EnhanceDropdown";
import TimeTracker, { formatTime } from "./TimeTracker";
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
  onEnhance: (type: EnhancementType, field: 'title' | 'details') => void;
  isEnhancing?: boolean;
  isDialogOpen?: boolean;
  onDialogChange?: (open: boolean) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEnhance, isEnhancing, isDialogOpen = false, onDialogChange }: TaskCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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

  const getColorClasses = () => {
    if (!task.color) return "";
    return {
      purple: "border-l-4 border-l-purple-500",
      blue: "border-l-4 border-l-blue-500", 
      green: "border-l-4 border-l-green-500",
      orange: "border-l-4 border-l-orange-500",
      red: "border-l-4 border-l-red-500",
      pink: "border-l-4 border-l-pink-500"
    }[task.color] || "";
  };
  
  const colorBorderClass = getColorClasses();



  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-2 sm:p-3 bg-card rounded-md border ${colorBorderClass} ${task.isFinished ? 'opacity-75 bg-muted' : ''} hover-elevate cursor-pointer flex items-center gap-1 sm:gap-2`}
        data-testid={`card-task-${task.id}`}
        onClick={() => onDialogChange?.(true)}
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
              className={`font-medium text-xs sm:text-sm truncate flex-1 ${task.isFinished ? 'line-through text-muted-foreground' : ''}`}
              data-testid="text-task-title"
            >
              {task.isFinished && '✓ '}{task.title || "Untitled Task"}
            </h3>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {task.color && (
                <div 
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    {
                      purple: "bg-purple-500",
                      blue: "bg-blue-500",
                      green: "bg-green-500", 
                      orange: "bg-orange-500",
                      red: "bg-red-500",
                      pink: "bg-pink-500"
                    }[task.color]
                  }`}
                />
              )}
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                {formatTime(task.timeSpent)}
              </span>
              {!task.isFinished && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (task.isRunning) {
                      onUpdate({ ...task, isRunning: false });
                    } else {
                      onUpdate({ ...task, isRunning: true });
                    }
                  }}
                  className="h-5 w-5 sm:h-6 sm:w-6"
                >
                  {task.isRunning ? <Pause className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                </Button>
              )}
              {!task.isFinished && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onUpdate({ ...task, isRunning: false, isFinished: true })}
                  className="h-5 w-5 sm:h-6 sm:w-6"
                >
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              )}
              <div className="hidden sm:block">
                <EnhanceDropdown onEnhance={(type) => onEnhance(type, 'title')} isEnhancing={isEnhancing} />
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete()}
                className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailsDialog
        task={task}
        isOpen={isDialogOpen}
        onClose={() => onDialogChange?.(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEnhance={onEnhance}
        isEnhancing={isEnhancing}
      />
    </>
  );
}
