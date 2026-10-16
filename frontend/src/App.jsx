import { useEffect, useState } from 'react'
import './App.css'
const STORAGE_KEY = 'schedule-tracker-tasks'
function getToday() {
  const today = new Date()

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
}
function changeDate(date, days) {
  const newDate = new Date(`${date}T00:00:00`)

  newDate.setDate(newDate.getDate() + days)

  return [
    newDate.getFullYear(),
    String(newDate.getMonth() + 1).padStart(2, '0'),
    String(newDate.getDate()).padStart(2, '0'),
  ].join('-')
}
function isTaskForSelectedDate(task, selectedDate) {
  if (task.recurrence === 'daily') {
    return true
  }

  if (task.recurrence === 'weekly') {
    const selectedDayName = new Date(
      `${selectedDate}T00:00:00`
    )
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toLowerCase()

    return task.recurrenceDays.includes(selectedDayName)
  }

  return task.date === selectedDate
}
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
    type: 'tasks',
    recurrence: 'none',
    recurrenceDays: [],
    date: getToday(),
    completions: {},
    completed: false,
    subtasks: [
      {
        id: 101,
        title: 'Push-ups',
        completed: false,
        completions: {},
      },
      {
        id: 102,
        title: 'Pull-ups',
        completed: false,
        completions: {},
      },
      {
        id: 103,
        title: 'Sit-ups',
        completed: false,
        completions: {},
      },
    ],
  },
  {
    id: 2,
    title: 'Read 20 pages',
    category: 'Reading',
    type: 'tasks',
    recurrence: 'none',
    recurrenceDays: [],
    date: getToday(),
    completions: {},
    completed: false,
    subtasks: [],
  },
  {
    id: 3,
    title: 'Study Operating Systems',
    category: 'Study',
    type: 'tasks',
    recurrence: 'none',
    recurrenceDays: [],
    date: getToday(), 
    completions: {},
    completed: false,
    subtasks: [],
  },
  {
    id: 4,
    title: 'Work on Schedule Tracker',
    category: 'Projects',
    type: 'tasks',
    recurrence: 'none',
    recurrenceDays: [],
    date: getToday(),
    completions: {},
    completed: false,
    subtasks: [],
  },
]
function App() {
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('Other')
  const [newRecurrence, setNewRecurrence] = useState('none')
  const [newRecurrenceDays, setNewRecurrenceDays] = useState([])
  const [selectedDate, setSelectedDate] = useState(getToday())
  
  const selectedYear = Number(selectedDate.split('-')[0])
  const selectedMonth = Number(selectedDate.split('-')[1]) - 1

  const monthName = new Date(
    selectedYear,
    selectedMonth
  ).toLocaleString('default', { month: 'long', year: 'numeric' })

  const daysInMonth = new Date(
    selectedYear,
    selectedMonth + 1,
    0
  ).getDate()

  // Convert Sunday-first JavaScript weekdays to Monday-first calendar columns.
  const firstDayOffset =
    (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7

  const calendarDays = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  


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
  
  const visibleTasks = tasks.filter((task) =>
    isTaskForSelectedDate(task, selectedDate)
  )

  const completedTasks = visibleTasks.filter(
    (task) => task.completions?.[selectedDate] || false
  ).length

  const totalTasks = visibleTasks.length

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100)

  function addTask() {
  if (newTask.trim() === '') {
    return
  }

  const task = {
    id: Date.now(),
    title: newTask.trim(),
    category: newCategory,
    type: 'tasks',
    recurrence: newRecurrence,
    recurrenceDays: newRecurrenceDays,
    date: getToday(),
    completions: {},
    completed: false,
    subtasks: [],
  }

  setTasks([...tasks, task])
  setNewTask('')
  setNewCategory('Other')
  setNewRecurrence('none')
  setNewRecurrenceDays([])
}
  function toggleTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id !== id) {
          return task
        }

        const completed = !task.completions?.[selectedDate]

        return {
          ...task,
          completions: {
            ...task.completions,
            [selectedDate]: completed,
          },
          completed,
          subtasks: task.subtasks.map((subtask) => ({
            ...subtask,
            completed,
          })),
        }
      })
    )
  }
  function toggleRecurringTask(taskId) {
    const today = getToday()

    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const currentlyCompleted = task.completions?.[today] || false

        return {
          ...task,
          completions: {
            ...task.completions,
            [today]: !currentlyCompleted,
          },
        }
      })
    )
  }

  function toggleRecurringSubtask(taskId, subtaskId) {
    const date = selectedDate

    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask.id !== subtaskId) {
            return subtask
          }

          const currentlyCompleted =
            subtask.completions?.[date] || false

          return {
            ...subtask,
            completions: {
              ...subtask.completions,
              [date]: !currentlyCompleted,
            },
          }
        })

        const allSubtasksCompleted =
          updatedSubtasks.length > 0 &&
          updatedSubtasks.every(
            (subtask) => subtask.completions?.[date] || false
          )

        return {
          ...task,
          subtasks: updatedSubtasks,
          completions: {
            ...task.completions,
            [date]: allSubtasksCompleted,
          },
        }
      })
    )
  }

 
  function toggleRecurringTaskWithSubtasks(taskId) {
    const date = selectedDate

    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const currentlyCompleted =
          task.completions?.[date] || false

        const newCompletedState = !currentlyCompleted

        return {
          ...task,
          completions: {
            ...task.completions,
            [date]: newCompletedState,
          },
          subtasks: task.subtasks.map((subtask) => ({
            ...subtask,
            completions: {
              ...subtask.completions,
              [date]: newCompletedState,
            },
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

        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask.id !== subtaskId) {
            return subtask
          }

          const completed = !subtask.completions?.[selectedDate]

          return {
            ...subtask,
            completions: {
              ...subtask.completions,
              [selectedDate]: completed,
            },
            completed,
          }
        })

        const allSubtasksCompleted =
          updatedSubtasks.length > 0 &&
          updatedSubtasks.every(
            (subtask) => subtask.completions?.[selectedDate] || false
          )

        return {
          ...task,
          subtasks: updatedSubtasks,
          completions: {
            ...task.completions,
            [selectedDate]: allSubtasksCompleted,
          },
          completed: allSubtasksCompleted,
        }
      })
    )
  }

  function toggleRecurrenceDay(day) {
    setNewRecurrenceDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((currentDay) => currentDay !== day)
      }

      return [...currentDays, day]
    })
  }
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Schedule Tracker</h1>
        <p>Plan your day. Track your progress.</p>
        <p>Selected date: {selectedDate}</p>
      </header>
      <div className="date-navigation">
        <button
          type="button"
          onClick={() => setSelectedDate(changeDate(selectedDate, -1))}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => setSelectedDate(getToday())}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setSelectedDate(changeDate(selectedDate, 1))}
        >
          Next
        </button>
      </div>
      <div className="date-picker">
        <label htmlFor="selected-date">Go to date:</label>
        <input
          id="selected-date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
      </div>
      
      <div className="monthly-calendar">
        
        <div className="calendar-header">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => {
              const previousMonth = new Date(
                selectedYear,
                selectedMonth - 1,
                1
              )
              const year = previousMonth.getFullYear()
              const month = String(previousMonth.getMonth() + 1).padStart(2, '0')
              const day = String(
                Math.min(
                  Number(selectedDate.split('-')[2]),
                  new Date(year, previousMonth.getMonth() + 1, 0).getDate()
                )
              ).padStart(2, '0')

              setSelectedDate(`${year}-${month}-${day}`)
            }}
          >
            ←
          </button>

          <h3>{monthName}</h3>

          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => {
              const nextMonth = new Date(
                selectedYear,
                selectedMonth + 1,
                1
              )
              const year = nextMonth.getFullYear()
              const month = String(nextMonth.getMonth() + 1).padStart(2, '0')
              const day = String(
                Math.min(
                  Number(selectedDate.split('-')[2]),
                  new Date(year, nextMonth.getMonth() + 1, 0).getDate()
                )
              ).padStart(2, '0')

              setSelectedDate(`${year}-${month}-${day}`)
            }}
          >
            →
          </button>
        </div>


        <div className="calendar-weekdays">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        
        <div className="calendar-days">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />
            }

            const date = [
              selectedYear,
              String(selectedMonth + 1).padStart(2, '0'),
              String(day).padStart(2, '0'),
            ].join('-')

            const isSelected = date === selectedDate
            const isToday = date === getToday()
            
            
            const dayTasks = tasks.filter((task) =>
              isTaskForSelectedDate(task, date)
            )

            const completedDayTasks = dayTasks.filter(
              (task) => task.completions?.[date] || false
            ).length

            const hasTasks = dayTasks.length > 0
            const dayProgressPercentage =
            dayTasks.length === 0
              ? 0
              : Math.round((completedDayTasks / dayTasks.length) * 100)
            const allTasksCompleted =
              hasTasks && completedDayTasks === dayTasks.length
            const someTasksCompleted = completedDayTasks > 0


            return (
              <button
                key={date}
                type="button"
                className={[
                  isSelected ? 'selected' : '',
                  isToday ? 'today' : '',
                  hasTasks ? 'has-tasks' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setSelectedDate(date)}
              >
                <span>{day}</span>
                {hasTasks && (
                  <span className="calendar-task-count">
                    {completedDayTasks}/{dayTasks.length}
                  </span>
                )}
                {hasTasks && (
                  <span className="calendar-mini-progress">
                    <span
                      className="calendar-mini-progress-fill"
                      style={{ width: `${dayProgressPercentage}%` }}
                    />
                  </span>
                )}
                {hasTasks && (
                  <span
                    className={[
                      'calendar-task-dot',
                      allTasksCompleted ? 'completed' : '',
                      someTasksCompleted && !allTasksCompleted ? 'in-progress' : '',
                    ].filter(Boolean).join(' ')}
                  />
                )}
              </button>
            )

          })}
        </div>
        
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-dot completed" />
            <span>All tasks completed</span>
          </div>

          <div className="legend-item">
            <span className="legend-dot in-progress" />
            <span>Tasks remaining</span>
          </div>

          <div className="legend-item">
            <span className="legend-today" />
            <span>Today</span>
          </div>

          <div className="legend-item">
            <span className="legend-selected" />
            <span>Selected date</span>
          </div>
        </div>


      </div>

      <section className="task-section">
        <div className="daily-progress">
          <div className="daily-progress-header">
            <div>
              <h3>Daily Progress</h3>
              <p>Keep moving toward your goals.</p>
            </div>

            <span className="daily-progress-count">
              {completedTasks} / {totalTasks}
            </span>
          </div>

          <div className="daily-progress-bar">
            <div
              className="daily-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
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

          <select
            value={newRecurrence}
            onChange={(event) => setNewRecurrence(event.target.value)}
          >
            <option value="none">Does not repeat</option>
            <option value="daily">Every day</option>
            <option value="weekly">Every week</option>
          </select>
          {newRecurrence === 'weekly' && (
            <div className="recurrence-days">
              <span>Repeat on:</span>

              <div className="day-options">
                {[
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ].map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={
                      newRecurrenceDays.includes(day)
                        ? 'day-button selected'
                        : 'day-button'
                    }
                    onClick={() => toggleRecurrenceDay(day)}
                  >
                    {day.slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={addTask}>
            Add
          </button>
        </div>

        <div className="task-list">
          {tasks
            .filter((task) => isTaskForSelectedDate(task, selectedDate))
            .map((task) => (
            <div className="task" key={task.id}>
              <div className="task-main">
                <label>
                  <input
                    type="checkbox"
                    checked={
                      task.recurrence !== 'none'
                        ? task.completions?.[selectedDate] || false
                        : task.completions?.[selectedDate] || false
                    }
                    onChange={() => {
                      if (task.recurrence !== 'none') {
                        toggleRecurringTaskWithSubtasks(task.id)
                      } else {
                        toggleTask(task.id)
                      }
                    }}
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
                            checked={
                              subtask.completions?.[selectedDate] || false
                            }
                            onChange={() => {
                              if (task.recurrence !== 'none') {
                                toggleRecurringSubtask(task.id, subtask.id)
                              } else {
                                toggleSubtask(task.id, subtask.id)
                              }
                            }}
                          />
                          <span
                            className={
                              subtask.completions?.[selectedDate] ? 'completed' : ''
                            }
                          >
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