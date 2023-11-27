import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppWrapper, TaskList, AddTaskForm, TaskItem, DeleteButton } from './styles';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';




function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', completed: false });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Fetch the first 5 tasks
      const response = await axios.get(`${API_URL}?_limit=5`);
      
      // Update the state with the fetched tasks
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  const handleTaskChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    // Remove the task from the state without making an API call
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  
    // Make the API call to delete the task
    axios.delete(`${API_URL}/${taskId}`)
      .then(() => console.log('Task deleted successfully'))
      .catch((error) => console.error('Error deleting task:', error));
  };
  

  const handleAddTask = async () => {
    if (newTask.title.trim() === '') {
      alert('Task title cannot be empty!');
      return;
    }

    try {
      // Log the task being added
      console.log('Adding Task:', newTask);

      // Post the new task
      await axios.post(API_URL, newTask);

      // Log a message after adding the task
      console.log('Task added successfully');

      // Reset the new task input
      setNewTask({ title: '', completed: false });

      // Fetch and update the task list
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <AppWrapper>
      <h1>Task Manager</h1>

      <AddTaskForm>
        <h2>Add Task</h2>
        <label>
          Title:
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </label>
        <label>
          Status:
          <select
            value={newTask.completed}
            onChange={(e) => setNewTask({ ...newTask, completed: e.target.value === 'true' })}
          >
            <option value={false}>Pending</option>
            <option value={true}>Completed</option>
          </select>
        </label>
        <button onClick={handleAddTask}>Add Task</button>
      </AddTaskForm>

      <TaskList>
        <h2>Task List</h2>
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} completed={task.completed}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskChange(task.id)}
              />
              <span>{task.title}</span>
              <DeleteButton onClick={() => handleDeleteTask(task.id)}>Delete</DeleteButton>
            </TaskItem>
          ))}
        </ul>
      </TaskList>
    </AppWrapper>
  );
}

export default App;
