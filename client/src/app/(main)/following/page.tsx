"use client";

import { useFollowingTimeline } from "@/hooks/api/timelines/useFollowingTimeline";
import PostTemplate from "@/components/post/PostTemplate";
import { useFollowingCount } from "@/hooks/api/follow/useFollowing";
import { useSession } from "next-auth/react";
import FiltersDropdownMenu from "@/components/menus/FiltersDropdownMenu";

const Following: React.FC = () => {
  const { data: session } = useSession();

  const {
    data: timelineData,
    error: timelineError,
    isPending: isPendingTimeline,
  } = useFollowingTimeline();

  const { data: followingCountData } = useFollowingCount({
    userId: session?.user?.id ?? "",
  });

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">FOLLOWING</h1>
            <FiltersDropdownMenu />
          </div>

          {isPendingTimeline && <p>Loading posts...</p>}
          {timelineError && (
            <p className="text-red-500">{timelineError?.message}</p>
          )}

          {followingCountData?.count === 0 && (
            <p className="text-primaryGray text-center">
              You are not following anyone.
            </p>
          )}

          {timelineData?.posts && timelineData.posts.length > 0
            ? timelineData.posts.map((post) => (
                <PostTemplate key={post.id} {...post} />
              ))
            : !isPendingTimeline && (
                <p className="text-primaryGray text-center">
                  No posts available
                </p>
              )}
        </div>
      </div>
    </>
  );
};

export default Following;
