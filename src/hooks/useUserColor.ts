import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchUserColor } from "@/utils/fetchUserColor";

const useUserColor = () => {
  const { data: session } = useSession();
  const [borderColor, setBorderColor] = useState<string>("#3b82f6");

  useEffect(() => {
    if (session?.user.id) {
      fetchUserColor(session.user.id)
        .then((color) => {
          setBorderColor(color);
        })
        .catch((error) => console.error("Error fetching user color:", error));
    }
  }, [session]);

  return borderColor;
};

export default useUserColor;
