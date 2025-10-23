import { useState } from "react";
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
  onEnhance: (type: EnhancementType) => void;
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleUpdate = (updates: Partial<Task>) => {
    setEditedTask({ ...editedTask, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleEnhance = (type: EnhancementType) => {
    onEnhance(type);
    setHasUnsavedChanges(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editedTask.title}
                    onChange={(e) => handleUpdate({ title: e.target.value })}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingTitle(false);
                    }}
                    autoFocus
                    data-testid="input-task-title"
                    className="font-semibold text-lg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingTitle(false)}
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span className="flex-1">{editedTask.title || "Untitled Task"}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingTitle(true)}
                    data-testid="button-edit-title"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <EnhanceDropdown onEnhance={handleEnhance} isEnhancing={isEnhancing} />
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
            <label className="text-sm font-medium text-muted-foreground">Details</label>
            <Textarea
              value={editedTask.details}
              onChange={(e) => handleUpdate({ details: e.target.value })}
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

          {hasUnsavedChanges && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditedTask(task);
                  setHasUnsavedChanges(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} data-testid="button-save-task" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
