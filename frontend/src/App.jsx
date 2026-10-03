import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Workout', completed: false },
    { id: 2, title: 'Read 20 pages', completed: false },
    { id: 3, title: 'Study Operating Systems', completed: false },
    { id: 4, title: 'Work on Schedule Tracker', completed: false },
  ])

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Schedule Tracker</h1>
        <p>Plan your day. Track your progress.</p>
      </header>

      <section className="task-section">
        <h2>Today's Tasks</h2>

        <div className="task-list">
          {tasks.map((task) => (
            <label className="task" key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <span className={task.completed ? 'completed' : ''}>
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App