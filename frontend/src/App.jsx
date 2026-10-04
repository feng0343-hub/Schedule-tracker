import { useEffect, useState } from 'react'
import './App.css'
const STORAGE_KEY = 'schedule-tracker-tasks'
function getSubtaskProgress(subtasks) {
  if (subtasks.length === 0) {
    return 0
  }

  const completed = subtasks.filter(
    (subtask) => subtask.completed
  ).length

  return Math.round((completed / subtasks.length) * 100)
}
const initialTasks = [
  {
    id: 1,
    title: 'Workout',
    category: 'Workout',
    completed: false,
    subtasks: [
      {
        id: 101,
        title: 'Push-ups',
        completed: false,
      },
      {
        id: 102,
        title: 'Pull-ups',
        completed: false,
      },
      {
        id: 103,
        title: 'Sit-ups',
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Read 20 pages',
    category: 'Reading',
    completed: false,
    subtasks: [],
  },
  {
    id: 3,
    title: 'Study Operating Systems',
    category: 'Study',
    completed: false,
    subtasks: [],
  },
  {
    id: 4,
    title: 'Work on Schedule Tracker',
    category: 'Projects',
    completed: false,
    subtasks: [],
  },
]
function App() {
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('Other')
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return initialTasks
  })
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    )
  }, [tasks])
  function addTask() {
  if (newTask.trim() === '') {
    return
  }

  const task = {
    id: Date.now(),
    title: newTask.trim(),
    category: newCategory,
    completed: false,
    subtasks: [],
  }

  setTasks([...tasks, task])
  setNewTask('')
  setNewCategory('Other')
}
  function toggleTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id !== id) {
          return task
        }

        const completed = !task.completed

        return {
          ...task,
          completed,
          subtasks: task.subtasks.map((subtask) => ({
            ...subtask,
            completed,
          })),
        }
      })
    )
  }
  function toggleSubtask(taskId, subtaskId) {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )

        const allSubtasksCompleted =
          updatedSubtasks.length > 0 &&
          updatedSubtasks.every((subtask) => subtask.completed)

        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted,
        }
      })
    )
  }
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Schedule Tracker</h1>
        <p>Plan your day. Track your progress.</p>
      </header>

      <section className="task-section">
        <h2>Today's Tasks</h2>
        <div className="add-task">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />

          <select
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
          >
            <option value="Workout">Workout</option>
            <option value="Study">Study</option>
            <option value="Reading">Reading</option>
            <option value="Writing">Writing</option>
            <option value="Projects">Projects</option>
            <option value="Other">Other</option>
          </select>

          <button type="button" onClick={addTask}>
            Add
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <div className="task" key={task.id}>
              <div className="task-main">
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  <div>
                    <span className={task.completed ? 'completed' : ''}>
                      {task.title}
                    </span>

                    <small className="task-category">
                      {task.category}
                    </small>
                  </div>
                </label>

                {task.subtasks.length > 0 && (
                  <>
                    <div className="subtasks">
                      {task.subtasks.map((subtask) => (
                        <div className="subtask" key={subtask.id}>
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleSubtask(task.id, subtask.id)}
                          />

                          <span className={subtask.completed ? 'completed' : ''}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="progress">
                      <div className="progress-info">
                        <span>Progress</span>
                        <span>{getSubtaskProgress(task.subtasks)}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${getSubtaskProgress(task.subtasks)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App