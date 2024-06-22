import MainNavBar from "@/components/menus/MainNavBar";
import Post from "@/components/post/PostTemplate";

const Home: React.FC = () => {
  return (
    <>
      <MainNavBar />
      <div className="mt-[70px] min-h-screen py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
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
