import { useState } from "react";
import { Heart, MessageSquare } from "react-feather";
import { Post } from "../types";
import { api } from "../utils";

const Comment = (values: Post) => {
  const [comment, setComment] = useState<Post>(values);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    if (!comment.isLiked) {
      setComment((prev: any) => ({ ...prev, isLiked: true, likes: prev.likes + 1 }));
      await api.put(`/post/interaction`, { ...comment, isLiked: true, likes: comment.likes + 1 });
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
        <div className="ml-2 font-bold">{comment.User.name}</div>
        <div className="ml-2 text-sm text-gray-500">
          {new Date(comment.date).toLocaleString()}
        </div>
      </div>
      <div className="ml-10">{comment.content}</div>
      <div className="flex flex-row mt-2 ml-10">
        <button className="flex items-center focus:outline-none" onClick={() => handleLike()}>
          <Heart size={16} strokeWidth={2} color={comment.isLiked ? '#f00000' : '#000'} />
          &nbsp;
          <span className="text-md">{comment.likes || " "}</span>
        </button>
        <button className="ml-3 focus:outline-none">
          <MessageSquare size={16} strokeWidth={2} />
        </button>
      </div>
      {comment.children && (
        <div className="mt-5 ml-3">
          <div
            className="text-blue-500 cursor-pointer"
            onClick={toggleExpanded}
          >
            {expanded ? "Ocultar comentários" : "Mostrar comentários"}
          </div>
          {expanded &&
            comment.children.map((comment: Post, index: number) => (
              <div className="pl-3 border-l-2" key={index}>
                <Comment {...comment} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments }: any) => {
  return (
    <div>
      {comments.children.map((values: Post, index: number) => (
        <div className="pb-4 border-b-2" key={index}>
          <Comment {...values} />
          {index !== values.children.length - 1 && (
            <div className="pl-4 ml-10 border-l-2 border-gray-400"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;