"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import { useUpdateProfile } from "@/hooks/api/account/useUpdateProfile";
import ProfilePicture from "@/components/ProfilePicture";

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
const DEFAULT_PROFILE_BANNER =
  "https://pbs.twimg.com/profile_banners/994250907826245635/1569352839/1080x360";

const EditProfile: React.FC = () => {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isProfilePictureChanged, setIsProfilePictureChanged] =
    useState<boolean>(false);
  const [profileBanner, setProfileBanner] = useState<string>("");
  const [isProfileBannerChanged, setIsProfileBannerChanged] =
    useState<boolean>(false);
  const [newProfileBannerUrl, setNewProfileBannerUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const updateProfileMutation = useUpdateProfile();

  // TODO: Replace with custom hook
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
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

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    setProfilePicture(newValue);
    setIsProfilePictureChanged(true);
  };

  const handleSaveProfilePicture = () => {
    if (profilePicture.trim() !== "") {
      updateProfileMutation.mutate(
        { profilePicture: profilePicture.trim() },
        {
          onSuccess: () => setIsProfilePictureChanged(false),
        },
      );
    }
  };

  const handleDeleteProfilePicture = () => {
    updateProfileMutation.mutate(
      { profilePicture: "" },
      {
        onSuccess: () => {
          setProfilePicture("");
          setIsProfilePictureChanged(false);
        },
      },
    );
  };

  const handleProfileBannerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    setProfileBanner(newValue);
    setIsProfileBannerChanged(true);
  };

  const handleSaveProfileBanner = () => {
    if (profileBanner.trim() !== "") {
      updateProfileMutation.mutate(
        { profileBanner: profileBanner.trim() },
        {
          onSuccess: () => setIsProfileBannerChanged(false),
        },
      );
    }
  };

  const handleDeleteProfileBanner = () => {
    updateProfileMutation.mutate(
      { profileBanner: "" },
      {
        onSuccess: () => {
          setProfileBanner("");
          setIsProfileBannerChanged(false);
        },
      },
    );
  };

  const isProfileInfoChanged = () => {
    if (!user) return false;
    return (
      profileName !== (user.profileName || "") ||
      username !== user.username ||
      bio !== (user.bio || "")
    );
  };

  const handleSaveProfileInfo = () => {
    if (isProfileInfoChanged()) {
      updateProfileMutation.mutate({
        profileName,
        username,
        bio,
      });
    }
  };

  const handleProfileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

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
              onChange={handleProfilePictureChange}
              placeholder="www.example.com/profile-picture.jpg"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
          <div className="mt-5 flex items-center gap-8">
            <ProfilePicture
              src={profilePicture}
              alt={`${user.profileName}'s profile picture`}
              size={90}
            />
            <div className="flex gap-6">
              <Button
                onClick={handleSaveProfilePicture}
                disabled={
                  updateProfileMutation.isPending ||
                  !isProfilePictureChanged ||
                  profilePicture.trim() === ""
                }
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteProfilePicture}
                disabled={!profilePicture}
              >
                Delete
              </Button>
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
                value={profileBanner}
                onChange={handleProfileBannerChange}
                placeholder="www.example.com/profile-banner.jpg"
                className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
              />
            </div>
            <div className="flex gap-6">
              <Button
                onClick={handleSaveProfileBanner}
                disabled={
                  updateProfileMutation.isPending ||
                  !isProfileBannerChanged ||
                  profileBanner.trim() === ""
                }
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteProfileBanner}
                disabled={!profileBanner}
              >
                Delete
              </Button>
            </div>
          </div>
          <img
            src={profileBanner || DEFAULT_PROFILE_BANNER}
            alt=""
            className="mt-5 h-[300px] max-w-[1000px] rounded-3xl"
          />
        </div>
        <div className="flex flex-col items-start gap-[30px]">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold">Profile Information</p>

            <p className="mt-3 text-primaryGray">Profile Name</p>
            <input
              type="text"
              value={profileName}
              onChange={handleProfileNameChange}
              placeholder="Ex. John Doe"
              className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-primaryGray">Username</p>
            <div className="relative flex items-center">
              <div className="absolute left-4 z-10 mb-[3px] select-none">@</div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Ex. john_doe"
                className="w-[400px] rounded-xl border-2 border-white/5 bg-transparent py-2 pl-[35px] pr-4 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-primaryGray">Biography</p>
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Ex. write about yourself"
              className="h-[200px] w-[400px] rounded-xl border-2 border-white/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-white/15 focus:border-white/15"
            />
          </div>
          <Button
            onClick={handleSaveProfileInfo}
            disabled={
              updateProfileMutation.isPending || !isProfileInfoChanged()
            }
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save"}
          </Button>

          {updateProfileMutation.isError && (
            <div className="mt-4 rounded-xl bg-red-500/20 p-3 text-red-500">
              {updateProfileMutation.error.message ||
                "Failed to update profile"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
