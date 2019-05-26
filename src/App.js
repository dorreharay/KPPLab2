import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

class App extends Component {
  state = {
    tasks: [],
    checked: [],
    error: false,
    newTitle: '',
    input: '',
    edit: false,
  }

  componentDidMount() {
    this.fetchTasks()
  }

  fetchTasks = async () => {
    try {
      const data = await axios.get('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374');
      let tasks = await data.data.tasks;
      this.setState({ tasks })
    } catch {
      this.setState({ error: true })
    }
  }

  handleCheck = (e) => async (_id) => {
    const { checked } = this.state;
    await axios.put('https://infinite-ridge-56986.herokuapp.com/user/tasks/check/5cb1ed89c6bf28192c152374', { _id });
    const newTasks = await axios.get('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374');
    let tasks = await newTasks.data.tasks;
    this.setState({ editIndex: false, tasks })
    // this.setState({ checked: checked.includes(index) ? checked.filter((item, id) => index !== item) : [...checked, index] })
  }

  handleAddTask = async () => {
    const { input } = this.state;
    try {
      const data = await axios.post('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374', { title: input });
      let tasks = await data.data.tasks;
      this.setState({ tasks })
    } catch {
      this.setState({ error: true })
    }
    this.setState({ input: '' })
  }

  handleEdit = (index) => {
    const { editIndex } = this.state; 

    this.setState({ editIndex: editIndex === index ? false : index })
  }

  handleEditFinal = async (_id) => {
    const { newTitle } = this.state;

    try {
      // await axios.put('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374', { data: { id, newTitle } });
      await axios.put('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374', { _id, newTitle });
      const newTasks = await axios.get('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374');
      let tasks = await newTasks.data.tasks;
      this.setState({ editIndex: false, tasks })
    } catch {
      this.setState({ error: true, editIndex: false })
    }
  }
  

  handleDelete = async (_id) => {
    try {
      await axios.delete('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374', { data: { ids: _id } });
      const data = await axios.delete('https://infinite-ridge-56986.herokuapp.com/user/tasks/5cb1ed89c6bf28192c152374', { data: { ids: _id } });
      let tasks = await data.data.tasks;
      this.setState({ tasks })
    } catch {
      this.setState({ error: true })
    }
  }

  handleInput = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    const { tasks, checked, error, input, editIndex } = this.state;

    return (
      <>
        <div className='heading'>KPP Tasks list</div>
        <div>
          <input id='input' className='input' placeholder='add task' type='text' value={input} onChange={this.handleInput}/>
          <button className='button' onClick={this.handleAddTask}>Add</button>
        </div>
       
        <div className='tasks'>
          {tasks.map((task, index) => (
            <div className='task' key={index}>
              {editIndex === index ? (
                <>
                  <input id='newTitle' type='text' style={{ width: '120px' }} onChange={this.handleInput} />
                  <button onClick={() => this.handleEditFinal(task._id)}>new</button>
                </> 
              ) : <div>{task.title}</div>}
                
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='edit' onClick={() => this.handleEdit(index)}>Edit</div>
                <div className='check' onClick={(e) => this.handleCheck(e)(task._id)}>Check</div>
                <div className='delete' onClick={(e) => this.handleDelete(task._id)}>Delete</div>
              </div>
              {task.checked && <div className='checked' />}
            </div>
          ))}
        </div>
        {error && <div onClick={this.fetchTasks}>Error, click to try again</div>}
      </>
      
    )
  }
}

export default App;