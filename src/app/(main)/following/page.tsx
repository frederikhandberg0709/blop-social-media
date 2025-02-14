"use client";

import { useFollowingTimeline } from "@/hooks/api/timelines/useFollowingTimeline";
import PostTemplate from "@/components/post/PostTemplate";
import { useFollowingCount } from "@/hooks/api/follow/useFollowing";
import { useSession } from "next-auth/react";

const Following: React.FC = () => {
  const { data: session } = useSession();

  const {
    data: timelineData,
    error: timelineError,
    isPending: isPendingTimeline,
  } = useFollowingTimeline();

  const { data: followingCountData } = useFollowingCount({
    userId: session?.user.id ?? "",
  });

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">FOLLOWING</h1>
            <button className="rounded-md border border-transparent px-[15px] py-[5px] font-medium text-black/50 transition duration-150 ease-in-out hover:border-blue-500/50 hover:bg-black/10 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white">
              Filters
            </button>
          </div>

          {isPendingTimeline && <p>Loading posts...</p>}
          {timelineError && (
            <p className="text-red-500">{timelineError?.message}</p>
          )}

          {followingCountData?.count === 0 && (
            <p>You are not following anyone.</p>
          )}

          {timelineData?.posts.map((post) => (
            <PostTemplate key={post.id} {...post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Following;
