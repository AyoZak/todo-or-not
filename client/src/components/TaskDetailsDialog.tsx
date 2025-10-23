import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Trash2, Save, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnhanceDropdown, { type EnhancementType } from "./EnhanceDropdown";
import TimeTracker from "./TimeTracker";
import ColorPicker, { type TaskColor } from "./ColorPicker";
import { type Task } from "./TaskCard";

interface TaskDetailsDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
  onEnhance: (type: EnhancementType, field: 'title' | 'details') => void;
  isEnhancing?: boolean;
}

export default function TaskDetailsDialog({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onEnhance,
  isEnhancing,
}: TaskDetailsDialogProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleUpdate = (updates: Partial<Task>) => {
    const updated = { ...editedTask, ...updates };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleEnhanceTitle = (type: EnhancementType) => {
    onEnhance(type, 'title');
  };

  const handleEnhanceDetails = (type: EnhancementType) => {
    onEnhance(type, 'details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2">
              {isEditingTitle ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => {
                    const updated = { ...editedTask, title: e.target.value };
                    setEditedTask(updated);
                  }}
                  onBlur={() => {
                    handleUpdate({ title: editedTask.title });
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate({ title: editedTask.title });
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  data-testid="input-task-title"
                  className="font-semibold text-lg flex-1"
                />
              ) : (
                <span 
                  className="flex-1 cursor-pointer hover:text-primary"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {editedTask.title || "Untitled Task"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <EnhanceDropdown onEnhance={handleEnhanceTitle} isEnhancing={isEnhancing} />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                data-testid="button-delete-task"
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Details</label>
              <EnhanceDropdown onEnhance={handleEnhanceDetails} isEnhancing={isEnhancing} />
            </div>
            <Textarea
              value={editedTask.details}
              onChange={(e) => {
                const updated = { ...editedTask, details: e.target.value };
                setEditedTask(updated);
              }}
              onBlur={() => handleUpdate({ details: editedTask.details })}
              placeholder="Add task details..."
              data-testid="textarea-task-details"
              className="min-h-[120px]"
            />
          </div>

          {editedTask.originalText && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-xs font-medium text-muted-foreground mb-2">Original Text:</p>
              <p className="text-sm text-muted-foreground" data-testid="text-original">
                {editedTask.originalText}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Color</label>
            <ColorPicker
              selectedColor={editedTask.color}
              onColorChange={(color) => handleUpdate({ color })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Time Tracking</label>
            <TimeTracker
              initialTime={editedTask.timeSpent}
              isRunning={editedTask.isRunning}
              isFinished={editedTask.isFinished}
              onStart={() => handleUpdate({ isRunning: true })}
              onPause={() => handleUpdate({ isRunning: false })}
              onFinish={() => handleUpdate({ isRunning: false, isFinished: true })}
              onTimeUpdate={(time) => handleUpdate({ timeSpent: time })}
            />
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}
