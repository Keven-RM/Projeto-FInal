import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Heart, MessageSquare } from "react-feather";
import { Post } from "../types";
import { api } from "../utils";

export default function Post(values: Post) {
    const { id, User, date, content, likes, isLiked } = values;
    const [thisPost, setThisPost] = useState({ likes, isLiked });
    const userId = 1

    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    const handleLike = async () => {
        if (!isLiked) {
            setThisPost(prev => ({ isLiked: true, likes: prev.likes + 1 }));
            await api.put(`/post/interaction`, { id: id, content: content, likes: likes + 1, isLiked: true, parentId: null, authorId: userId });
        }
    }

    return (
        <article className='h-[450px] w-[500px] flex flex-col bg-slate-200'>
            <header className="w-full flex flex-row justify-start items-center h-[15%] px-3 bg-slate-50">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div className="ml-2 font-bold">{User.name}</div>
                <div className="ml-2 text-sm text-gray-500">{new Date(date).toLocaleDateString()}</div>
            </header>

            <main className='px-3 h-[70%]'>
                <p>{content}</p>
            </main>

            <footer className="flex justify-around h-[15%] py-3 px-[140px] bg-slate-50">
                <button className='flex flex-row items-center focus:outline-none' onClick={() => handleLike()}>
                    <Heart size={25} strokeWidth={2} color={thisPost.isLiked ? '#f00000' : '#000'} />
                    &nbsp;
                    {thisPost.likes || " "}
                </button>
                {
                    !postId
                        ? <Link className="flex flex-row items-center focus:outline-none" href={`http://localhost:3000/post?id=${id}`}>
                            <MessageSquare size={25} strokeWidth={2} />
                        </Link>
                        : <div className="flex flex-row items-center focus:outline-none">
                            <MessageSquare size={25} strokeWidth={2} />
                        </div>
                }
            </footer>
        </article >
    );
}