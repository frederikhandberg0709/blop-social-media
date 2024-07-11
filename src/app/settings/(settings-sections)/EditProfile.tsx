"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  profileName?: string;
  bio?: string;
  profilePicture?: string;
  profileBanner?: string;
}

const EditProfile: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileBanner, setProfileBanner] = useState<string>("");

  useEffect(() => {
    if (!session) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        setProfileName(data.profileName || "");
        setUsername(data.username);
        setBio(data.bio || "");
        setProfileBanner(data.profileBanner || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [session]);

  const handleSave = async () => {
    if (!session || !user) return;

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          profileName,
          username,
          bio,
          profileBanner,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setProfileName(updatedUser.profileName || "");
      setUsername(updatedUser.username);
      setBio(updatedUser.bio || "");
      setProfileBanner(updatedUser.profileBanner || "");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!session || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-bold text-[25px]">Edit Profile</h1>
      <div className="flex flex-col gap-[30px] mt-[30px]">
        <p>
          Customize and personalize your public appearance by editing your
          profile. This includes updating your profile name, username, profile
          picture, and profile banner.
        </p>
        <div>
          <p>Profile Picture</p>
          <p>Image link: </p>
          <p>{session?.user.profilePicture}</p>
          <div className="flex items-center gap-8">
            <img
              src={session?.user.profilePicture}
              alt=""
              className="h-[90px] w-[90px] rounded-full mt-2"
            />
            <div className="flex gap-6">
              <button className="font-semibold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out">
                Upload
              </button>
              <button className="font-semibold text-white bg-red-600 hover:bg-red-800 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div>
          <p>Profile Banner</p>
          <div className="flex justify-between">
            <p>Image link: </p>
            <p>{session?.user.profileBanner}</p>
            <div className="flex gap-6">
              <button className="font-semibold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out">
                Upload
              </button>
              <button className="font-semibold text-white bg-red-600 hover:bg-red-800 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out">
                Delete
              </button>
            </div>
          </div>
          <img
            src={session?.user.profileBanner}
            // src="https://pbs.twimg.com/profile_banners/994250907826245635/1569352839/1080x360"
            alt=""
            className="h-[300px] max-w-[1000px] rounded-3xl mt-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/50">Profile Name</p>
          <input
            type="text"
            value={profileName || session?.user.username}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile Name"
            className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 bg-transparent outline-none"
          />
          {/* <p className="font-bold text-[20px]">
            {session?.user.profileName ?? session?.user.username}
          </p> */}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/50">Username</p>
          <div className="relative flex items-center">
            <div className="absolute z-10 left-4 mb-[3px]">@</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-[35px] pr-4 py-2 w-[400px] rounded-xl border-2 border-white/5 bg-transparent outline-none"
            />
          </div>
          {/* <p className="font-bold text-[20px]">@{session?.user.username}</p> */}
        </div>
        <div className="flex flex-col gap-2">
          <p>Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 bg-transparent outline-none"
          />
          {/* <p className="font-bold text-[20px]">
            Some textsadsadsadkosapdkpoasd...
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
