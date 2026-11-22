import './App.css'
import Sidebar from "./components/Sidebar.jsx";
import NoteView from "./components/NoteView.jsx";
import {useEffect, useRef, useState} from "react";
import {apiFetch} from "./utils/client.js";

export default function App() {
  const [activeNote, setActiveNote] = useState();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const res = await apiFetch("/notes")
      if (!res.ok) return
      const data = await res.json()
      setNotes(data)
    }
    loadNotes()
  }, [])

  const timer = useRef(null)
  const ms = 600

  const saveNote = (note) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      apiFetch(`/notes/${note.id}`, {
        method: "PATCH",
        body: JSON.stringify({title: note.title, content: note.content})
      })
    }, ms)
  }

  const changeName = (newName) => {
    const updated = {...notes.find((note) => note.id === activeNote), title: newName}
    setNotes((prev) => prev.map((note) => note.id === activeNote ? updated : note))
    saveNote(updated)
  }
  const changeContent = (newContent) => {
    const updated = {...notes.find((note) => note.id === activeNote), content: newContent}
    setNotes((prev) => prev.map((note) => note.id === activeNote ? updated : note))
    saveNote(updated)
  }
  const togglePinned = async (id) => {
    const note = notes.find((note) => note.id === id)
    const res = await apiFetch(`/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({is_pinned: !note.is_pinned})
    })
    if (!res.ok) return

    const updated = await res.json()
    setNotes((prev) => prev.map((note) => note.id === updated.id ? updated : note));
  }

  const handleActiveNote = (id) => {
    let active = id;
    setActiveNote(active);
    console.log(active)
  }

  const deleteNote = async (id) => {
    const res = await apiFetch(`/notes/${id}`, {
      method: "DELETE"
    })
    if (!res.ok) return

    const softDelete = await res.json()
    setNotes((prev) => prev.map((note) => note.id === softDelete.id ? softDelete : note))
    if (id === activeNote) {
      setActiveNote(undefined)
    }
  }


  const handleNewNote = async () => {
    const res = await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({title: "Titulo", content: "Nueva nota"})
    })
    if (!res.ok) return

    const created = await res.json()
    setNotes((prev) => [...prev, created])
    setActiveNote(created.id)
  }

  const currentNote = notes.find(note => activeNote === note.id);
  return (
    <div className="flex h-screen w-full bg-paper text-left text-ink">
      <Sidebar notes={notes} onSelect={handleActiveNote} onNewNote={handleNewNote} activeId={activeNote} togglePinned={togglePinned}/>
      <NoteView currentNote={currentNote} onDelete={deleteNote} changeName={changeName} changeContent={changeContent}/>
    </div>
  );
}
