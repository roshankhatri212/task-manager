import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppWrapper, TaskList, AddTaskForm, TaskItem, DeleteButton, EditButton } from './styles';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}?_limit=5`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleTaskChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTask(taskToEdit);
  };

  const handleUpdateTask = async () => {
    try {
      await axios.put(`${API_URL}/${editingTask.id}`, editingTask);
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? editingTask : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleAddTask = async () => {
    if (newTask.title.trim() === '') {
      alert('Task title cannot be empty!');
      return;
    }

    try {
      const uniqueId = generateUniqueId();
      const taskToAdd = { ...newTask, id: uniqueId };

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

  return (
    <AppWrapper>
      <h1>Task Manager</h1>

      <AddTaskForm>
        <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
        <label>
          Title:
          <input
            type="text"
            value={editingTask ? editingTask.title : newTask.title}
            onChange={(e) => {
              if (editingTask) {
                setEditingTask((prevTask) => ({ ...prevTask, title: e.target.value }));
              } else {
                setNewTask({ ...newTask, title: e.target.value });
              }
            }}
          />
        </label>
        <label>
          Status:
          <select
            value={editingTask ? editingTask.completed : newTask.completed}
            onChange={(e) => {
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
        {editingTask ? (
          <>
            <button onClick={handleUpdateTask}>Update Task</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAddTask}>Add Task</button>
        )}
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
              <EditButton onClick={() => handleEditTask(task.id)}>Edit</EditButton>
            </TaskItem>
          ))}
        </ul>
      </TaskList>
    </AppWrapper>
  );
}

export default App;
