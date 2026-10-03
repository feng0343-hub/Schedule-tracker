import { useState } from 'react'
import './App.css'

function App() {
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('Other')
  const [tasks, setTasks] = useState([
    {
      id: 2,
      title: 'Pull-ups',
      category: 'Workout',
      completed: false,
    },
    {
      id: 3,
      title: 'Read 20 pages',
      category: 'Reading',
      completed: false,
    },
    {
      id: 4,
      title: 'Study Operating Systems',
      category: 'Study',
      completed: false,
    },
    {
      id: 5,
      title: 'Work on Schedule Tracker',
      category: 'Projects',
      completed: false,
    },
  ])
  function addTask() {
  if (newTask.trim() === '') {
    return
  }

  const task = {
    id: Date.now(),
    title: newTask.trim(),
    category: newCategory,
    completed: false,
  }

  setTasks([...tasks, task])
  setNewTask('')
  setNewCategory('Other')
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