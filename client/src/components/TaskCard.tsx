import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EnhanceDropdown, { type EnhancementType } from "./EnhanceDropdown";
import TimeTracker from "./TimeTracker";
import ColorPicker, { type TaskColor } from "./ColorPicker";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(!task.title && !task.details);

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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${colorBorderClass} bg-card hover-elevate`}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          data-testid="button-drag-task"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 space-y-3">
          {isEditing ? (
            <Input
              value={task.title}
              onChange={(e) => onUpdate({ ...task, title: e.target.value })}
              onBlur={() => task.title && setIsEditing(false)}
              placeholder="Task title..."
              autoFocus
              data-testid="input-task-title"
              className="font-medium"
            />
          ) : (
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-medium text-base cursor-pointer hover:text-primary flex-1"
                onClick={() => setIsEditing(true)}
                data-testid="text-task-title"
              >
                {task.title || "Untitled Task"}
              </h3>
              <EnhanceDropdown onEnhance={onEnhance} isEnhancing={isEnhancing} />
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full text-left"
            data-testid="button-toggle-details"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? "Hide details" : "Show details"}
          </button>

          {isExpanded && (
            <div className="space-y-3">
              <Textarea
                value={task.details}
                onChange={(e) => onUpdate({ ...task, details: e.target.value })}
                placeholder="Add task details..."
                data-testid="textarea-task-details"
                className="min-h-[80px] text-sm"
              />

              {task.originalText && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Original Text:</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-original">
                    {task.originalText}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Color:</p>
                <ColorPicker
                  selectedColor={task.color}
                  onColorChange={(color) => onUpdate({ ...task, color })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <TimeTracker
              initialTime={task.timeSpent}
              isRunning={task.isRunning}
              isFinished={task.isFinished}
              onStart={() => onUpdate({ ...task, isRunning: true })}
              onPause={() => onUpdate({ ...task, isRunning: false })}
              onFinish={() => onUpdate({ ...task, isRunning: false, isFinished: true })}
              onTimeUpdate={(time) => onUpdate({ ...task, timeSpent: time })}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              data-testid="button-delete-task"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
