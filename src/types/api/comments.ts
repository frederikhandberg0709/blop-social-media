import { CommentProps } from "../components/comment";

export interface CommentsResponse {
  comments: CommentProps[];
}

export interface CreateCommentParams {
  postId: string;
  parentId?: string;
  title?: string;
  content: string;
}
