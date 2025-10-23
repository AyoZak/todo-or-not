import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, MoreVertical, Plus, Trash2, Star, AlertTriangle } from "lucide-react";
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
  isImportant?: boolean;
  isUrgent?: boolean;
}

interface TaskListProps {
  list: TaskListData;
  onUpdate: (list: TaskListData) => void;
  onDelete: () => void;
  onTaskUpdate: (taskId: string, task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: () => void;
  onTaskEnhance: (taskId: string, type: EnhancementType, field: 'title' | 'details') => void;
  enhancingTaskId?: string;
  openTaskDialog?: {listId: string, taskId: string} | null;
  onTaskDialogChange?: (listId: string, taskId: string, open: boolean) => void;
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
  openTaskDialog,
  onTaskDialogChange,
  dragListeners,
  dragAttributes,
}: TaskListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id });

  const totalTime = list.tasks.reduce((sum, task) => sum + task.timeSpent, 0);

  const getListClasses = () => {
    let classes = "h-full flex flex-col p-4";
    if (list.isImportant && list.isUrgent) {
      classes += " border-2 border-rose-300";
    } else if (list.isUrgent) {
      classes += " border-2 border-rose-200";
    } else if (list.isImportant) {
      classes += " border-2 border-amber-200";
    }
    return classes;
  };

  return (
    <div className="w-full min-w-0" data-testid={`list-${list.id}`}>
      <Card className={getListClasses()}>
        <div className="flex items-start gap-2 mb-3 sm:mb-4">
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
            <div className="flex items-center justify-between w-full">
              {isEditingTitle ? (
                <Input
                  value={list.title}
                  onChange={(e) => onUpdate({ ...list, title: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingTitle(false);
                  }}
                  autoFocus
                  data-testid="input-list-title"
                  className="font-semibold text-base sm:text-lg flex-1"
                />
              ) : (
                <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                  <h2
                    className="font-semibold text-base sm:text-lg cursor-pointer hover:text-primary truncate"
                    onClick={() => setIsEditingTitle(true)}
                    data-testid="text-list-title"
                  >
                    {list.title}
                  </h2>
                  {list.isImportant && <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  {list.isUrgent && <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400 fill-rose-400 flex-shrink-0" />}
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onUpdate({ ...list, isImportant: !list.isImportant })}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {list.isImportant ? 'Remove Important' : 'Mark as Important'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdate({ ...list, isUrgent: !list.isUrgent })}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {list.isUrgent ? 'Remove Urgent' : 'Mark as Urgent'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">{list.tasks.length} tasks</span>
              <span className="font-mono font-medium" data-testid="text-list-total-time">
                {formatTime(totalTime)}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 min-h-[150px] sm:min-h-[200px] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)]"
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
                onEnhance={(type, field) => onTaskEnhance(task.id, type, field)}
                isEnhancing={enhancingTaskId === task.id}
                isDialogOpen={openTaskDialog?.listId === list.id && openTaskDialog?.taskId === task.id}
                onDialogChange={(open) => onTaskDialogChange?.(list.id, task.id, open)}
              />
            ))}
          </SortableContext>
        </div>

        <Button
          onClick={onTaskAdd}
          variant="outline"
          size="sm"
          className="mt-3 sm:mt-4 w-full gap-1 sm:gap-2"
          data-testid="button-add-task"
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs sm:text-sm">Add Task</span>
        </Button>
      </Card>
    </div>
  );
}
