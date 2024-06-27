import { Tooltip } from "@/components/Tooltip";
import MainNavBar from "@/components/menus/MainNavBar";
import Post from "@/components/post/PostTemplate";

const Home: React.FC = () => {
  return (
    <>
      {/* <MainNavBar /> */}
      <div className="mt-[70px] min-h-screen py-6 flex flex-col justify-start items-center sm:py-12">
        <div className="flex flex-col gap-[15px]">
          <div className="flex justify-between items-center">
            {/* Page title */}
            <h1 className="text-[30px] font-semibold">HOME</h1>
            {/* Filters */}
            <button className="font-medium text-white/50 hover:text-white px-[15px] py-[5px] rounded-md hover:bg-white/10 border border-transparent hover:border-blue-500/50 transition duration-150 ease-in-out">
              Filters
            </button>
          </div>
          <Post
            profilePicture="https://via.placeholder.com/150"
            profileName="John Doe"
            username="johndoe"
            timestamp="June 22, 2024"
            textContent="This is a sample post with text, an image, and a video."
            imageContent="https://via.placeholder.com/600x400"
            videoContent="https://www.w3schools.com/html/mov_bbb.mp4"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
