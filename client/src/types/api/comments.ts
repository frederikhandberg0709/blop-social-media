import { QueryKey } from "@tanstack/react-query";
import { CommentProps } from "../components/comment";

export interface CommentResponse {
  comments: CommentProps[];
}

export interface DeleteCommentResponse {
  message: string;
}

export interface DeleteCommentParams {
  commentId: string;
}

export interface DeleteCommentContext {
  queries: [QueryKey, CommentResponse | undefined][];
}

export interface CreateCommentParams {
  postId: string;
  parentId?: string;
  title?: string;
  content: string;
}
