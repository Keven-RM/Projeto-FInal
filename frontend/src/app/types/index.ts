export type Post = {
  id?: number;
  date: Date;
  content: string;
  likes: number;
  isLiked: boolean;
  children: Post[];
  parentId?: number;
  User: {
    id?: number;
    name: string;
    email?: string;
  }
}
