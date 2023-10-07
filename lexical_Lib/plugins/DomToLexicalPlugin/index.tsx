import React, {useEffect} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {$generateNodesFromDOM} from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';

type TPros = {
    html: string;
}

function DomToLexicalPlugin({html}:TPros) {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const nodes = $generateNodesFromDOM(editor,dom);
            $getRoot().select();
            $insertNodes(nodes);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return null
}

export default DomToLexicalPlugin
