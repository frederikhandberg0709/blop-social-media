import { CommentProps } from "@/types/components/comment";

const countTotalComments = (comments: CommentProps[]) => {
  return comments.reduce((total, comment) => {
    let count = 1;
    const replies = comment.children || comment.replies || [];
    if (replies.length > 0) {
      count += countTotalComments(replies);
    }

    return total + count;
  }, 0);
};

export default countTotalComments;
