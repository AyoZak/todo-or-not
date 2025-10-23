import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
}: {
  list: TaskListData;
  onUpdate: (list: TaskListData) => void;
  onDelete: () => void;
  onTaskUpdate: (taskId: string, task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: () => void;
  onTaskEnhance: (taskId: string, type: EnhancementType) => void;
  enhancingTaskId?: string;
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
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}

export default function TaskBoard() {
  const [lists, setLists] = useState<TaskListData[]>([
    {
      id: "list-1",
      title: "To Do",
      tasks: [],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [enhancingTaskId, setEnhancingTaskId] = useState<string | null>(null);

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
    setLists([...lists, newList]);
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

  const handleTaskEnhance = async (listId: string, taskId: string, type: EnhancementType) => {
    setEnhancingTaskId(taskId);

    // TODO: Implement actual Gemini API call
    // Simulate API call for demo
    setTimeout(() => {
      const list = lists.find((l) => l.id === listId);
      const task = list?.tasks.find((t) => t.id === taskId);

      if (task) {
        const enhancedTask = {
          ...task,
          originalText: task.originalText || task.title,
          title: `[Enhanced ${type}] ${task.title}`,
          details: `${task.details}\n\n[This would be enhanced by Gemini AI based on the "${type}" enhancement type]`,
        };

        handleUpdateTask(listId, taskId, enhancedTask);
      }

      setEnhancingTaskId(null);
    }, 2000);
  };

  const allTaskIds = lists.flatMap((list) => list.tasks.map((task) => task.id));

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold" data-testid="text-app-title">
          TaskFlow AI
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddList} variant="default" className="gap-2" data-testid="button-add-list">
            <Plus className="h-4 w-4" />
            New List
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full">
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
                  onTaskEnhance={(taskId, type) => handleTaskEnhance(list.id, taskId, type)}
                  enhancingTaskId={enhancingTaskId || undefined}
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
