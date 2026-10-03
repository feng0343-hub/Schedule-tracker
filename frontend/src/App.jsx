import { useState } from 'react'
import './App.css'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Workout', completed: false },
    { id: 2, title: 'Read 20 pages', completed: false },
    { id: 3, title: 'Study Operating Systems', completed: false },
    { id: 4, title: 'Work on Schedule Tracker', completed: false },
  ])
  function addTask() {
  if (newTask.trim() === '') {
    return
  }

  const task = {
    id: Date.now(),
    title: newTask.trim(),
    completed: false,
  }

  setTasks([...tasks, task])
  setNewTask('')
}
  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
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

          <button type="button" onClick={addTask}>
            Add
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <div className="task" key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? 'completed' : ''}>
                  {task.title}
                </span>
              </label>

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