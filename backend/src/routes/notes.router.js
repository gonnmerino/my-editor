import {Router} from "express";
import {randomUUID} from "node:crypto";
import {createNote, deleteNotePermanently, findAllByUser, softDeleteNote, updateNote} from "../repositories/notes.js";


const router = Router()

router.get("/", async (req, res) => {
  res.json(await findAllByUser(req.user.id));
});

router.post("/", async (req, res) => {
  const {title = "", content = ""} = req.body;
  const note = await createNote({id: randomUUID(), userId: req.user.id, title, content});
  res.status(201).json(note);
})

router.patch("/:id", async (req, res) => {
  const note = await updateNote(req.params.id, req.user.id, req.body);
  if (!note) {
    return res.status(404).json({error: "Nota no encontrada"});
  }
  res.json(note);
});

router.delete("/:id", async (req, res) => {
  const note = await softDeleteNote(req.params.id, req.user.id);
  if (!note) {
    return res.status(404).json({error: "Nota no encontrada"});
  }
  res.json(note);
});

router.delete("/:id/permanent", async (req, res) => {
  const deleted = await deleteNotePermanently(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({error: "Nota no encontrada"});
  }
  res.status(204).end();
});

export default router;