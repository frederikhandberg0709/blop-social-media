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
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <div className="mt-5 flex flex-col gap-[30px]">
        <p className="text-base opacity-75">
          Customize and personalize your public appearance by editing your
          profile. This includes updating your profile name, username, profile
          picture, and profile banner.
        </p>
        <div>
          <p className="text-xl font-semibold">Profile Picture</p>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-primaryGray">Image Link</p>
            <input
              type="text"
              value={session?.user.profilePicture}
              placeholder="www.example.com/profile-picture.jpg"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
          <div className="mt-5 flex items-center gap-8">
            <img
              src={session?.user.profilePicture}
              alt=""
              className="mt-2 h-[90px] w-[90px] rounded-full"
            />
            <div className="flex gap-6">
              <PrimaryButton>Upload</PrimaryButton>
              <DangerButton>Delete</DangerButton>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold">Profile Banner</p>
          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-primaryGray">Image Link</p>
              <input
                type="text"
                value={session?.user.profileBanner}
                placeholder="www.example.com/profile-banner.jpg"
                className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
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
            className="mt-5 h-[300px] max-w-[1000px] rounded-3xl"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="opacity-50">Profile Name</p>
          <input
            type="text"
            value={profileName || session?.user.username}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile Name"
            className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="opacity-50">Username</p>
          <div className="relative flex items-center">
            <div className="absolute left-4 z-10 mb-[3px] select-none">@</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent py-2 pl-[35px] pr-4 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
