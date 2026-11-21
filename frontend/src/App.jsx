import './App.css'
import Sidebar from "./components/Sidebar.jsx";
import {initialNotes} from "./data/pages.js";
import NoteView from "./components/NoteView.jsx";
import {useState} from "react";

export default function App() {

  const [activeNote, setActiveNote] = useState();
  const [notes, setNotes] = useState(initialNotes);

  const changeName = (newName) => {
    setNotes(notes.map((note) => note.id === activeNote ? {...note, title: newName}: note))
  }
  const changeContent = (newContent) => {
    setNotes(notes.map((note) => note.id === activeNote ? {...note, content: newContent}: note))
  }
  const togglePinned = (id) => {
    setNotes(notes.map((note) => note.id === id ? {...note, isPinned: !note.isPinned}: note))
  }

  const handleActiveNote = (id) => {
    let active = id;
    setActiveNote(active);
    console.log(active)
  }

  const deleteNote = (id) => {
    let noteId = id;
    setNotes(notes.filter(note => note.id !== noteId))

    if(id === activeNote) {
      setActiveNote(undefined)
    }
  }

  const handleNewNote = () => {
    const newNote = {
      id: crypto.randomUUID().toString(),
      title: "Titulo",
      content: "Nueva nota",
      isPinned: false,
      isNote: true,
    }
    setNotes([...notes, newNote])
    setActiveNote(newNote.id)
  }

  const currentNote = notes.find(note => activeNote === note.id);
  return (
    <div className="flex h-screen w-full bg-paper text-left text-ink">
      <Sidebar notes={notes} onSelect={handleActiveNote} onNewNote={handleNewNote} activeId={activeNote} togglePinned={togglePinned}/>
      <NoteView currentNote={currentNote} onDelete={deleteNote} changeName={changeName} changeContent={changeContent}/>
    </div>
  );
}
