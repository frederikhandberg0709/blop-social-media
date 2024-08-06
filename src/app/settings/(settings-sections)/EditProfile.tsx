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

const DEFAULT_PROFILE_PICTURE =
  "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light";
const DEFAULT_PROFILE_BANNER = "";

const EditProfile: React.FC = () => {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isProfilePictureChanged, setIsProfilePictureChanged] =
    useState<boolean>(false);
  const [profileBanner, setProfileBanner] = useState<string>("");
  const [newProfilePictureUrl, setNewProfilePictureUrl] = useState<string>("");
  const [newProfileBannerUrl, setNewProfileBannerUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) return;

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
        setProfilePicture(data.profilePicture || "");
        setProfileBanner(data.profileBanner || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  // const updateProfile = async (updatedFields: Partial<User>) => {
  //   if (!session?.user?.id || !user) return;

  //   try {
  //     const response = await fetch("/api/update-profile", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: user.id,
  //         ...updatedFields,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update profile");
  //     }

  //     const updatedUser = await response.json();
  //     setUser(updatedUser);

  //     // Update specific fields based on what was changed
  //     if ("profileName" in updatedFields)
  //       setProfileName(updatedUser.profileName || "");
  //     if ("username" in updatedFields) setUsername(updatedUser.username);
  //     if ("bio" in updatedFields) setBio(updatedUser.bio || "");
  //     if ("profilePicture" in updatedFields)
  //       setProfilePicture(updatedUser.profilePicture || "");
  //     if ("profileBanner" in updatedFields)
  //       setProfileBanner(updatedUser.profileBanner || "");

  //     await update({
  //       ...session,
  //       user: {
  //         ...session.user,
  //         ...updatedFields,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //   }
  // };

  const updateProfile = async (updatedFields: Partial<User>) => {
    if (!session?.user?.id || !user) return;

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...updatedFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);

      // Update specific fields based on what was changed
      Object.keys(updatedFields).forEach((key) => {
        switch (key) {
          case "profileName":
            setProfileName(updatedUser.profileName || "");
            break;
          case "username":
            setUsername(updatedUser.username);
            break;
          case "bio":
            setBio(updatedUser.bio || "");
            break;
          case "profilePicture":
            setProfilePicture(updatedUser.profilePicture || "");
            break;
          case "profileBanner":
            setProfileBanner(updatedUser.profileBanner || "");
            break;
        }
      });

      await update({
        ...session,
        user: {
          ...session.user,
          ...updatedFields,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    setProfilePicture(newValue);
    setIsProfilePictureChanged(true);
  };

  const handleSaveProfile = () => updateProfile({ profileName, username, bio });

  const handleSaveProfilePicture = async () => {
    if (profilePicture.trim() !== "") {
      await updateProfile({ profilePicture: profilePicture.trim() });
      setIsProfilePictureChanged(false);
    }
  };

  // const handleSaveProfilePicture = () => {
  //   if (newProfilePictureUrl) {
  //     updateProfile({ profilePicture: newProfilePictureUrl });
  //     setNewProfilePictureUrl("");
  //   }
  // };

  const handleDeleteProfilePicture = () =>
    updateProfile({ profilePicture: "" });

  const handleSaveProfileBanner = () => {
    if (newProfileBannerUrl) {
      updateProfile({ profileBanner: newProfileBannerUrl });
      setNewProfileBannerUrl("");
    }
  };

  const handleDeleteProfileBanner = () => updateProfile({ profileBanner: "" });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
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
              value={profilePicture}
              // value={newProfilePictureUrl || profilePicture}
              // onChange={(e) => setNewProfilePictureUrl(e.target.value)}
              onChange={handleProfilePictureChange}
              placeholder="www.example.com/profile-picture.jpg"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
          <div className="mt-5 flex items-center gap-8">
            <img
              src={profilePicture || DEFAULT_PROFILE_PICTURE}
              alt=""
              className="mt-2 h-[90px] w-[90px] rounded-full"
            />
            <div className="flex gap-6">
              <PrimaryButton
                onClick={handleSaveProfilePicture}
                disabled={
                  !isProfilePictureChanged || profilePicture.trim() === ""
                }
              >
                Save
              </PrimaryButton>
              <DangerButton onClick={handleDeleteProfilePicture}>
                Delete
              </DangerButton>
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
                value={newProfileBannerUrl}
                onChange={(e) => setNewProfileBannerUrl(e.target.value)}
                placeholder="www.example.com/profile-banner.jpg"
                className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
              />
            </div>
            <div className="flex gap-6">
              <PrimaryButton onClick={handleSaveProfileBanner}>
                Save
              </PrimaryButton>
              <DangerButton onClick={handleDeleteProfileBanner}>
                Delete
              </DangerButton>
            </div>
          </div>
          <img
            src={profileBanner}
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
            placeholder="Ex. John Doe"
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
              placeholder="Ex. john_doe"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent py-2 pl-[35px] pr-4 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ex. write about yourself"
            className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
