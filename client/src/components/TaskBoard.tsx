import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskList, { type TaskListData } from "./TaskList";
import { type Task } from "./TaskCard";
import { type EnhancementType } from "./EnhanceDropdown";
import ThemeToggle from "./ThemeToggle";

function SortableTaskList({
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
}: {
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
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskList
        list={list}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
        onTaskAdd={onTaskAdd}
        onTaskEnhance={onTaskEnhance}
        enhancingTaskId={enhancingTaskId}
        openTaskDialog={openTaskDialog}
        onTaskDialogChange={onTaskDialogChange}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}

export default function TaskBoard() {
  const [lists, setLists] = useState<TaskListData[]>(() => {
    const saved = localStorage.getItem('taskflow-lists');
    return saved ? JSON.parse(saved) : [{
      id: "list-1",
      title: "To Do",
      tasks: [],
    }];
  });

  useEffect(() => {
    localStorage.setItem('taskflow-lists', JSON.stringify(lists));
  }, [lists]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [enhancingTaskId, setEnhancingTaskId] = useState<string | null>(null);
  const [openTaskDialog, setOpenTaskDialog] = useState<{listId: string, taskId: string} | null>(null);

  // Global timer system
  useEffect(() => {
    const interval = setInterval(() => {
      setLists(currentLists => 
        currentLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task => 
            task.isRunning && !task.isFinished
              ? { ...task, timeSpent: task.timeSpent + 1 }
              : task
          )
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeList = lists.find((list) =>
      list.tasks.some((task) => task.id === activeId)
    );
    const overList = lists.find(
      (list) => list.id === overId || list.tasks.some((task) => task.id === overId)
    );

    if (!activeList || !overList || activeList.id === overList.id) return;

    setLists((lists) => {
      const activeListIndex = lists.findIndex((l) => l.id === activeList.id);
      const overListIndex = lists.findIndex((l) => l.id === overList.id);

      const activeTask = activeList.tasks.find((t) => t.id === activeId);
      if (!activeTask) return lists;

      const newLists = [...lists];
      newLists[activeListIndex] = {
        ...activeList,
        tasks: activeList.tasks.filter((t) => t.id !== activeId),
      };
      newLists[overListIndex] = {
        ...overList,
        tasks: [...overList.tasks, activeTask],
      };

      return newLists;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isTaskDrag = lists.some((list) =>
      list.tasks.some((task) => task.id === activeId)
    );

    if (isTaskDrag) {
      const listWithActiveTask = lists.find((list) =>
        list.tasks.some((task) => task.id === activeId)
      );
      if (!listWithActiveTask) return;

      const oldIndex = listWithActiveTask.tasks.findIndex((t) => t.id === activeId);
      const newIndex = listWithActiveTask.tasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setLists((lists) =>
          lists.map((list) =>
            list.id === listWithActiveTask.id
              ? {
                  ...list,
                  tasks: arrayMove(list.tasks, oldIndex, newIndex),
                }
              : list
          )
        );
      }
    } else {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setLists(arrayMove(lists, oldIndex, newIndex));
      }
    }
  };

  const handleAddList = () => {
    const newList: TaskListData = {
      id: `list-${Date.now()}`,
      title: "New List",
      tasks: [],
    };
    setLists([newList, ...lists]);
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter((l) => l.id !== listId));
  };

  const handleUpdateList = (listId: string, updatedList: TaskListData) => {
    setLists(lists.map((l) => (l.id === listId ? updatedList : l)));
  };

  const handleAddTask = (listId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "",
      details: "",
      color: null,
      timeSpent: 0,
      isRunning: false,
      isFinished: false,
    };

    setLists(
      lists.map((l) =>
        l.id === listId ? { ...l, tasks: [...l.tasks, newTask] } : l
      )
    );
    
    // Open dialog for new task
    setOpenTaskDialog({ listId, taskId: newTask.id });
  };

  const handleUpdateTask = (listId: string, taskId: string, updatedTask: Task) => {
    setLists(
      lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              tasks: l.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            }
          : l
      )
    );
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    setLists(
      lists.map((l) =>
        l.id === listId
          ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) }
          : l
      )
    );
  };

  const handleTaskEnhance = async (listId: string, taskId: string, type: EnhancementType, field: 'title' | 'details') => {
    setEnhancingTaskId(taskId);

    try {
      const list = lists.find((l) => l.id === listId);
      const task = list?.tasks.find((t) => t.id === taskId);

      if (!task) {
        setEnhancingTaskId(null);
        return;
      }

      const taskText = field === 'title' ? (task.title || 'Untitled Task') : (task.details || 'No details');
      
      const response = await fetch("/api/enhance-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskText,
          enhancementType: type,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to enhance task: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Invalid JSON response:", responseText);
        throw new Error("Invalid response from server");
      }

      const { enhancedText } = data;
      console.log("Received enhanced text:", enhancedText);

      // Clean and extract only the essential content
      let cleanText = enhancedText
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '')   // Remove italic markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/^(Here's|Here are|Okay,|Sure,|I'll|Let me|The following|Below is).*?:/gmi, '') // Remove intro phrases
        .replace(/^(Option \d+:|Why it's better:|Key Considerations:|To give you).*$/gmi, '') // Remove explanation sections
        .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
        .trim();
      
      // Extract the actual enhanced content (skip explanatory text)
      const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
      
      // Look for quoted content or the first substantial line
      let extractedContent = '';
      for (const line of lines) {
        if (line.includes('"') && line.length > 10) {
          // Extract quoted content
          const match = line.match(/"([^"]+)"/g);
          if (match) {
            extractedContent = match[0].replace(/"/g, '');
            break;
          }
        } else if (!line.toLowerCase().includes('option') && 
                   !line.toLowerCase().includes('why') &&
                   !line.toLowerCase().includes('better') &&
                   !line.toLowerCase().includes('consider') &&
                   line.length > 10) {
          extractedContent = line;
          break;
        }
      }
      
      cleanText = extractedContent || lines[0] || cleanText.substring(0, 200);

      const enhancedTask = {
        ...task,
        originalText: task.originalText || (field === 'title' ? task.title : task.details),
        ...(field === 'title' 
          ? { title: cleanText.split('\n')[0].substring(0, 100) || cleanText.substring(0, 100) }
          : { details: cleanText }
        ),
      };
      console.log("Updating task with:", enhancedTask);

      // Force immediate update
      setLists(currentLists => 
        currentLists.map(l => 
          l.id === listId 
            ? {
                ...l,
                tasks: l.tasks.map(t => t.id === taskId ? enhancedTask : t)
              }
            : l
        )
      );
    } catch (error) {
      console.error("Enhancement failed:", error);
      // You could add a toast notification here
    } finally {
      setEnhancingTaskId(null);
    }
  };

  const allTaskIds = lists.flatMap((list) => list.tasks.map((task) => task.id));

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-14 w-auto text-foreground">
            <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5"/>
            <circle cx="55" cy="25" r="3" fill="currentColor"/>
          </svg>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-semibold" data-testid="text-app-title">
              TodoOrNot
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Keeps your hours in check, and ruins your excuses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleAddList} 
            variant="outline" 
            size="sm"
            className="gap-1 sm:gap-2 hover:bg-accent font-medium px-2 sm:px-4 py-2" 
            data-testid="button-add-list"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New List</span>
            <span className="sm:hidden">New</span>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 sm:gap-6 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '100%', margin: '0 auto', justifyContent: 'center' }}>
            <SortableContext
              items={lists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {lists.map((list) => (
                <SortableTaskList
                  key={list.id}
                  list={list}
                  onUpdate={(updatedList) => handleUpdateList(list.id, updatedList)}
                  onDelete={() => handleDeleteList(list.id)}
                  onTaskUpdate={(taskId, task) => handleUpdateTask(list.id, taskId, task)}
                  onTaskDelete={(taskId) => handleDeleteTask(list.id, taskId)}
                  onTaskAdd={() => handleAddTask(list.id)}
                  onTaskEnhance={(taskId, type, field) => handleTaskEnhance(list.id, taskId, type, field)}
                  enhancingTaskId={enhancingTaskId || undefined}
                  openTaskDialog={openTaskDialog}
                  onTaskDialogChange={(listId, taskId, open) => setOpenTaskDialog(open ? {listId, taskId} : null)}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeId && lists.some((l) => l.id === activeId) ? (
              <div className="opacity-50">
                <TaskList
                  list={lists.find((l) => l.id === activeId)!}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onTaskUpdate={() => {}}
                  onTaskDelete={() => {}}
                  onTaskAdd={() => {}}
                  onTaskEnhance={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
