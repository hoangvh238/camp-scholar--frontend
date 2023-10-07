import React, {useEffect} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {$generateHtmlFromNodes} from '@lexical/html';

interface IPros {
    setHtmlString: React.Dispatch<React.SetStateAction<string>>
}

function HTMLSerializerPlugin({setHtmlString}:IPros) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener(({editorState}) => {
            editorState.read(()=> {
                const htmlString = $generateHtmlFromNodes(editor, null);
                setHtmlString(htmlString);
            })
        })
        return () => {
            removeUpdateListener()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editor]);
    
    return null
}

export default HTMLSerializerPlugin
