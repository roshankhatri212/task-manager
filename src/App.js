import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppWrapper, TaskList, AddTaskForm, TaskItem, DeleteButton, EditButton } from './styles';

// API URL for fetching and interacting with tasks
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  // State variables for managing tasks and task-related operations
  const [tasks, setTasks] = useState([]); // Array to store tasks
  const [newTask, setNewTask] = useState({ title: '', completed: false }); // State for the new task input
  const [editingTask, setEditingTask] = useState(null); // State for the task being edited

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      // Fetch the first 5 tasks from the API
      const response = await axios.get(`${API_URL}?_limit=5`);
      // Update the tasks state with the fetched tasks
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Helper function to generate a unique ID for a new task
  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Function to handle changes in task completion status
  const handleTaskChange = (taskId) => {
    // Map over the tasks and update the completion status of the selected task
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    // Update the tasks state with the modified tasks
    setTasks(updatedTasks);
  };

  // Function to handle the deletion of a task
  const handleDeleteTask = async (taskId) => {
    try {
      // Make an API call to delete the task by its ID
      await axios.delete(`${API_URL}/${taskId}`);
      // Filter out the deleted task from the tasks state
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      // Update the tasks state with the filtered tasks
      setTasks(updatedTasks);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Function to initiate the editing of a task
  const handleEditTask = (taskId) => {
    // Find the task to be edited from the tasks state
    const taskToEdit = tasks.find((task) => task.id === taskId);
    // Set the editingTask state to the task being edited
    setEditingTask(taskToEdit);
  };

  // Function to handle the update of an edited task
  const handleUpdateTask = async () => {
    try {
      // Make an API call to update the task using its ID
      await axios.put(`${API_URL}/${editingTask.id}`, editingTask);
      // Map over the tasks and replace the edited task with the updated version
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? editingTask : task
      );
      // Update the tasks state with the modified tasks
      setTasks(updatedTasks);
      // Reset the editingTask state
      setEditingTask(null);
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Function to cancel the editing of a task
  const handleCancelEdit = () => {
    // Reset the editingTask state
    setEditingTask(null);
  };

  // Function to add a new task
  const handleAddTask = async () => {
    // Check if the title of the new task is not empty
    if (newTask.title.trim() === '') {
      alert('Task title cannot be empty!');
      return;
    }

    try {
      // Generate a unique ID for the new task
      const uniqueId = generateUniqueId();
      // Create a task object with the newTask state and the generated ID
      const taskToAdd = { ...newTask, id: uniqueId };

      // Make an API call to add the new task
      await axios.post(API_URL, taskToAdd);
      console.log('Task added successfully');

      // Append the new task to the current tasks state
      setTasks((prevTasks) => [...prevTasks, taskToAdd]);

      // Reset the new task input
      setNewTask({ title: '', completed: false });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // JSX structure for the Task Manager app

  return (
    <AppWrapper>
      {/* Application title */}
      <h1>Task Manager</h1>
  
      {/* Form for adding or editing a task */}
      <AddTaskForm>
        <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
        {/* Input field for the task title */}
        <label>
          Title:
          <input
            type="text"
            value={editingTask ? editingTask.title : newTask.title}
            onChange={(e) => {
              // If editing a task, update the title of the editingTask
              // If adding a new task, update the title of the newTask
              if (editingTask) {
                setEditingTask((prevTask) => ({ ...prevTask, title: e.target.value }));
              } else {
                setNewTask({ ...newTask, title: e.target.value });
              }
            }}
          />
        </label>
        {/* Dropdown for task completion status */}
        <label>
          Status:
          <select
            value={editingTask ? editingTask.completed : newTask.completed}
            onChange={(e) => {
              // If editing a task, update the completion status of the editingTask
              // If adding a new task, update the completion status of the newTask
              if (editingTask) {
                setEditingTask((prevTask) => ({ ...prevTask, completed: e.target.value === 'true' }));
              } else {
                setNewTask({ ...newTask, completed: e.target.value === 'true' });
              }
            }}
          >
            <option value={false}>Pending</option>
            <option value={true}>Completed</option>
          </select>
        </label>
        {/* Conditional rendering of buttons based on whether editing or adding a task */}
        {editingTask ? (
          <>
            <button onClick={handleUpdateTask}>Update Task</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAddTask}>Add Task</button>
        )}
      </AddTaskForm>
  
      {/* Task List section */}
      <TaskList>
        <h2>Task List</h2>
        {/* Rendering the list of tasks */}
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} completed={task.completed}>
              {/* Checkbox for marking task completion */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskChange(task.id)}
              />
              {/* Displaying the task title */}
              <span>{task.title}</span>
              {/* Buttons for deleting and editing the task */}
              <DeleteButton onClick={() => handleDeleteTask(task.id)}>Delete</DeleteButton>
              <EditButton onClick={() => handleEditTask(task.id)}>Edit</EditButton>
            </TaskItem>
          ))}
        </ul>
      </TaskList>
    </AppWrapper>
  );
}

export default App;
