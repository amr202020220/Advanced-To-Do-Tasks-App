// src/TodoApp.jsx
import { useState, useEffect } from "react";
import "./TodoApp.css";

function TodoApp() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium"); // low | medium | high
  const [filter, setFilter] = useState("all");        // all | active | completed
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");         // newest | oldest | priority

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((t) => ({
        id: t.id ?? Date.now() + Math.random(),
        text: t.text ?? "",
        completed: !!t.completed,
        priority: t.priority || "medium",
        createdAt: t.createdAt || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const text = task.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTask("");
    setPriority("medium");
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const incompleteCount = tasks.filter((t) => !t.completed).length;

  // فلترة + سيرش + ترتيب
  const priorityOrder = { low: 0, medium: 1, high: 2 };

  let visibleTasks = tasks.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (
      searchTerm &&
      !t.text.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  visibleTasks = [...visibleTasks].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sort === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sort === "priority") {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <section className="todo">
      <div className="todo-inner">
        <div className="todo-glow" />

        <p className="todo-eyebrow">Advanced Practice Project</p>
        <h2 className="todo-title">
          To-Do <span>Tasks</span>
        </h2>
        <p className="todo-subtitle">
          Task manager with React state, filters, search, priority, sorting, and local storage.
        </p>

        {/* input row */}
        <div className="todo-input-row">
          <input
            type="text"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="todo-priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button onClick={handleAddTask}>Add</button>
        </div>

        {/* toolbar */}
        <div className="todo-toolbar">
          <span className="todo-count">
            {incompleteCount} task{incompleteCount !== 1 ? "s" : ""} remaining
          </span>

          <div className="todo-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <div className="todo-sort-search">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="todo-sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
            </select>

            <input
              type="text"
              className="todo-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {tasks.some((t) => t.completed) && (
            <button
              className="todo-clear"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          )}
        </div>

        {/* list */}
        <ul className="todo-list">
          {visibleTasks.length === 0 && (
            <li className="todo-empty">
              {tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks match your filter/search."}
            </li>
          )}

          {visibleTasks.map((t) => (
            <li
              key={t.id}
              className={`todo-item ${t.completed ? "completed" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggleTask(t.id)}
                />
                <span className="todo-text">{t.text}</span>
              </label>

              <div className={`todo-pill todo-pill-${t.priority}`}>
                {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
              </div>

              <button
                className="todo-delete"
                onClick={() => handleDeleteTask(t.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TodoApp;
