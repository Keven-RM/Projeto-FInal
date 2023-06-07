import { useState } from "react";

import { context } from "../context";
import { api } from "../utils";

export default function CreatePost() {
    const [postContent, setPostContent] = useState<string>('')
    const { updatePosts } = context();

    const isButtonActive = postContent.trim().length > 0;

    const user = {
        name: 'Keven'
    };

    async function handleCreatePost(event: React.SyntheticEvent) {
        try {
            event.preventDefault();

            const { data } = await api.post('/post/create', { authorId: 1, content: postContent, likes: 0, parentId: null });
            
            updatePosts({...data, User: user});

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleCreatePost} className='w-[500px] bg-slate-50 p-5 flex flex-col justify-center gap-5'>
            <textarea
                className='w-full min-h-[8rem] resize-y rounded-md border-2 border-gray-400 bg-slate-100'
                name="message"
                placeholder="Conteúdo"
                onChange={value => setPostContent(value.target.value)}
                required
            ></textarea>
            {
                <button
                    type="submit"
                    disabled={!isButtonActive}
                    className={`p-3 ${isButtonActive ? 'bg-blue-600' : 'bg-blue-900'} ${isButtonActive ? 'text-white' : 'text-gray-400'} text-xl font-medium uppercase rounded-md transition duration-100 ease-in-out`}>
                    Publicar
                </button>
            }
        </form>
    )
}