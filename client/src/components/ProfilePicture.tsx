import React from "react";
import Image from "next/image";

const DEFAULT_PROFILE_PICTURE =
  "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light";

interface ProfilePictureProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  alt,
  size = 40,
  className = "",
}) => {
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={src || DEFAULT_PROFILE_PICTURE}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        unoptimized
      />
    </div>
  );
};

export default ProfilePicture;
