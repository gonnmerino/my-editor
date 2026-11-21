import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from "@tiptap/extension-highlight";
import {SlashCommand} from "./utils/slashCommand.js";
import {BubbleToolbar} from "./components/BubbleToolbar.jsx";
import {Markdown} from "@tiptap/markdown";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

export const Tiptap = ({content, onContentChange}) => {
    const editor = useEditor({
        extensions: [StarterKit, Highlight, SlashCommand, Markdown, TaskList, TaskItem],
        content: content,
        contentType: "markdown",
        onUpdate: ({editor}) => {
            console.log(editor.getMarkdown())
            onContentChange(editor.getMarkdown())
        },

    })
    console.log("Tiptap se dibuja", !!editor)
    if (!editor) return null

    return (
        <>
            <EditorContent editor={editor}/>
            <BubbleToolbar editor={editor}/>
        </>
    )
}

export default Tiptap
