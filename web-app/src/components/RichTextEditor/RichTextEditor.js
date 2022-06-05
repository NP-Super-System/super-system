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
                    plugins: 'a11ychecker advcode casechange export formatpainter image editimage link anchor linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinycomments tinymcespellchecker',
                    toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents link anchor',
                    toolbar_mode: 'floating',
                    menubar: "insert",
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                }}
                onEditorChange={handleChange} />
        </>
    )
}

export default RichTextEditor;