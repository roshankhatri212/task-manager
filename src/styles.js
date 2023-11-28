import styled from 'styled-components';

export const AppWrapper = styled.div`
  text-align: center;
  padding: 20px;
`;

export const TaskList = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

export const TaskItem = styled.li`
  display: flex;
  align-items: center;
  margin: 10px 0;
  background-color: ${(props) => (props.completed ? '#d4edda' : '#fff3cd')};
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  input {
    margin-right: 10px;
  }

  span {
    flex-grow: 1;
    text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  }
`;

export const AddTaskForm = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 10px;
  }

  label {
    display: block;
    margin-bottom: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
  }

  button {
    background-color: #28a745;
    color: #fff;
    padding: 8px 16px;
    margin-right: 8px;
    border: none;
    cursor: pointer;
  }
`;

export const DeleteButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  padding: 4px 8px;
  border: none;
  margin-left: 10px;
  cursor: pointer;
`;

export const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  border: none;
  margin-left: 10px;
  cursor: pointer;
`;
