import React, {useEffect} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

type TProps ={
    setTextContentCounting: React.Dispatch<React.SetStateAction<number>>;
}

function TextCounterPlugin({setTextContentCounting}: TProps) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener(
            ({editorState}) => {
                editorState.read(() => {
                    const text = $getRoot().getTextContent().trim().split(/\s+/);
                    const filterWords = text.filter(word => word != '');
                    setTextContentCounting(filterWords.length);
                })
            }
        )
        return () => {
            removeUpdateListener();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editor]);

    return (
        null
    )
}

export default TextCounterPlugin
