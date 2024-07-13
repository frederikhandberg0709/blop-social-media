// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { useSession } from "next-auth/react";
// import { fetchUserColor } from "@/utils/fetchUserColor";

// interface ColorContextProps {
//   borderColor: string;
//   setBorderColor: (color: string) => void;
// }

// const ColorContext = createContext<ColorContextProps | undefined>(undefined);

// export const ColorProvider = ({ children }: { children: ReactNode }) => {
//   const { data: session } = useSession();
//   const [borderColor, setBorderColor] = useState<string>("#3b82f6"); // Default color

//   useEffect(() => {
//     if (session) {
//       fetchUserColor(session.user.id).then((color) => {
//         setBorderColor(color);
//       });
//     }
//   }, [session]);

//   return (
//     <ColorContext.Provider value={{ borderColor, setBorderColor }}>
//       {children}
//     </ColorContext.Provider>
//   );
// };

// export const useColor = () => {
//   const context = useContext(ColorContext);
//   if (context === undefined) {
//     throw new Error("useColor must be used within a ColorProvider");
//   }
//   return context;
// };
