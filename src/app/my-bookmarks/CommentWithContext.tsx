import Link from "next/link";
import CommentTemplate from "@/components/CommentTemplate";
import { CommentProps } from "@/types/CommentProps";

interface ExtendedCommentProps extends CommentProps {
  post?: {
    id: string;
    user: {
      username: string;
      profileName?: string;
    };
  };
}

const CommentWithContext: React.FC<ExtendedCommentProps> = (props) => {
  const { post, ...commentProps } = props;

  console.log("CommentWithContext props:", JSON.stringify(props, null, 2));

  return (
    <div className="rounded-lg border p-4 transition duration-200 dark:border-darkBorder dark:hover:border-darkBorderHover sm:rounded-2xl">
      {post && post.user && post.id && (
        <div className="mb-2 flex items-center gap-4">
          <p className="text-sm text-primaryGray">
            Commented on{" "}
            <Link
              href={`/profile/${post.user.username}`}
              className="font-bold hover:text-black hover:underline dark:hover:text-white"
            >
              {post.user.profileName || `@${post.user.username}`}
            </Link>
            &apos;s post.
          </p>
          <Link
            href={`/post/${post.id}`}
            className="rounded-full bg-white/10 px-2 py-1 text-sm text-white/75 transition duration-200 hover:bg-white/15 hover:text-white active:bg-white/20"
          >
            Show post
          </Link>
        </div>
      )}
      <CommentTemplate {...commentProps} />
    </div>
  );
};

export default CommentWithContext;
