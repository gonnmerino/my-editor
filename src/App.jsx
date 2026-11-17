import './App.css'
import Sidebar from "./components/Sidebar.jsx";
import {initialNotes} from "./data/pages.js";
import TaskView from "./components/TaskView.jsx";
import {useState} from "react";

export default function App() {

  const [activeTask, setActiveTask] = useState();
  const [tasks, setTasks] = useState(initialNotes);

  const changeName = (newName) => {
    setTasks(tasks.map((task) => task.id === activeTask ? {...task, title: newName}: task))
  }
  const changeContent = (newContent) => {
    setTasks(tasks.map((task) => task.id === activeTask ? {...task, content: newContent}: task))
  }
  const togglePinned = (id) => {
    setTasks(tasks.map((task) => task.id === id ? {...task, isPinned: !task.isPinned}: task))
  }

  const handleActiveTask = (id) => {
    let active = id;
    setActiveTask(active);
    console.log(active)
  }
  const currentTask = tasks.find(task => activeTask === task.id);
  return (
    <div className="flex h-screen w-full bg-paper text-left text-ink">
      <Sidebar tasks={tasks} onSelect={handleActiveTask} activeId={activeTask} togglePinned={togglePinned}/>
      <TaskView currentTask={currentTask} changeName={changeName} changeContent={changeContent}/>
    </div>
  );
}
