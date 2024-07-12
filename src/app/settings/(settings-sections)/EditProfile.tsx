"use client";

import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
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
          <p className="text-[20px] font-semibold">Profile Picture</p>
          <div className="flex flex-col gap-2 mt-3">
            <p className="text-white/50">Image Link</p>
            <input
              type="text"
              value={session?.user.profilePicture}
              // onChange={(e) => setProfileName(e.target.value)}
              placeholder="Image Link"
              className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 hover:border-white/15 focus:border-white/15 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-8 mt-5">
            <img
              src={session?.user.profilePicture}
              alt=""
              className="h-[90px] w-[90px] rounded-full mt-2"
            />
            <div className="flex gap-6">
              <PrimaryButton>Upload</PrimaryButton>
              <DangerButton>Delete</DangerButton>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[20px] font-semibold">Profile Banner</p>
          <div className="flex justify-between items-end mt-3">
            <div className="flex flex-col gap-2">
              <p className="text-white/50">Image Link</p>
              <input
                type="text"
                value={session?.user.profileBanner}
                // onChange={(e) => setProfileName(e.target.value)}
                placeholder="Image Link"
                className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 hover:border-white/15 focus:border-white/15 bg-transparent outline-none"
              />
              {/* <p>{session?.user.profileBanner}</p> */}
            </div>
            <div className="flex gap-6">
              <PrimaryButton>Upload</PrimaryButton>
              <DangerButton>Delete</DangerButton>
            </div>
          </div>
          <img
            src={session?.user.profileBanner}
            alt=""
            className="h-[300px] max-w-[1000px] rounded-3xl mt-5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/50">Profile Name</p>
          <input
            type="text"
            value={profileName || session?.user.username}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile Name"
            className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 hover:border-white/15 focus:border-white/15 bg-transparent outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/50">Username</p>
          <div className="relative flex items-center">
            <div className="absolute z-10 left-4 mb-[3px] select-none">@</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-[35px] pr-4 py-2 w-[400px] rounded-xl border-2 border-white/5 hover:border-white/15 focus:border-white/15 bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="px-4 py-2 w-[400px] rounded-xl border-2 border-white/5 hover:border-white/15 focus:border-white/15 bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
