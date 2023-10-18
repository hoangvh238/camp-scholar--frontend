import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html';

import React from 'react'
import {toast} from "react-toastify"
import axios from 'axios';
import { getCookie } from 'cookies-next';

type TPros = {
    setHtmlString: React.Dispatch<React.SetStateAction<string>>;
    useFor: string
}

function EditorSaveButtonPlugin({setHtmlString, useFor}: TPros) {
    const [editor] = useLexicalComposerContext();

    const handleUpdateBio = async (bio: string) => {
        // try {
        //     const access_token = getCookie("accessToken");
        //     if(access_token) {
        //         const response = await updateAbout(access_token, bio);
        //         console.log(response);
        //     }
        // } catch (error) {
        //     if(axios.isAxiosError(error)) {
        //         console.log(error);
        //         toast.warning("Update bio failed!")
        //     }
        // }
    }

    const handleSaveLetter = async () => {
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            setHtmlString(htmlString);
            if(useFor==="about") {
                handleUpdateBio(htmlString);
                toast.success("Change bio successfully!");
            }
        })
    }

    return (
        <>
            {/* <UnlinkButton 
            textContent={'Save'} 
            icon={''} 
            iconPosition={'left'} 
            backgroundColor={'bg-blue-700'} 
            method={() => handleSaveLetter()} 
            tailwind={'text-white mt-[20px]'}            
            ></UnlinkButton> */}
        </>
    )
}

export default EditorSaveButtonPlugin
