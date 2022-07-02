import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'react-bootstrap';

const RichTextEditor = props => {

    const { onChange } = props;
    const editorRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (e.target.closest(".mce-window .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                e.stopImmediatePropagation();
            }
        };
        document.addEventListener("focusin", handler);
        return () => document.removeEventListener("focusin", handler);
    }, []);

    const handleChange = e => {
        const content = editorRef.current.getContent();

        // console.log(content);
        onChange(content);
    }

    return (
        <>
            <Editor
                onInit={
                    (e, editor) => {
                        editorRef.current = editor;
                    }
                }
                init={{
                    selector: 'textarea',
                    plugins: 'image link anchor table ',
                    toolbar: 'image link anchor table',
                    toolbar_mode: 'floating',
                    menubar: "insert",
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Super System',
                    resize: false,
                }}
                onEditorChange={handleChange} />
        </>
    )
}

export default RichTextEditor;