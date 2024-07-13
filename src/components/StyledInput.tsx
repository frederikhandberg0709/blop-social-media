// import React, { InputHTMLAttributes } from "react";
// import useDynamicBorder from "@/hooks/useDynamicBorder";

// interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
//   value: string;
//   onChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => void;
//   placeholder?: string;
//   type?: string;
//   as?: "input" | "textarea";
//   className?: string;
//   borderWidth?: string;
// }

// const StyledInput: React.FC<StyledInputProps> = ({
//   as = "input",
//   borderWidth = "2px",
//   ...props
// }) => {
//   const {
//     handleFocus,
//     handleBlur,
//     handleMouseEnter,
//     handleMouseLeave,
//     getDynamicBorderStyle,
//   } = useDynamicBorder();

//   const dynamicStyle = getDynamicBorderStyle(borderWidth);

//   if (as === "textarea") {
//     return (
//       <textarea
//         {...props}
//         style={dynamicStyle}
//         className="p-[15px] w-full bg-transparent outline-none rounded-xl transition duration-150 ease-in-out"
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       />
//     );
//   }

//   return (
//     <input
//       {...props}
//       style={dynamicStyle}
//       className="p-[15px] w-full bg-transparent outline-none rounded-xl transition duration-150 ease-in-out"
//       onFocus={handleFocus}
//       onBlur={handleBlur}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     />
//   );
// };

// export default StyledInput;

import React, { useState, useEffect, forwardRef } from "react";
import { useSession } from "next-auth/react";

interface StyledInputProps {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea";
  className?: string;
  borderWidth?: string;
}

const StyledInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  StyledInputProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      type = "text",
      as = "input",
      className,
      borderWidth = "2px",
    },
    ref
  ) => {
    const { data: session } = useSession();
    const [borderColor, setBorderColor] = useState<string>("#3b82f6"); // Default color

    useEffect(() => {
      const fetchUserColor = async (userId: string) => {
        const response = await fetch(`/api/user-color?userId=${userId}`);
        const data = await response.json();
        return data.color || "#3b82f6"; // Fallback to default color
      };

      if (session?.user.id) {
        fetchUserColor(session.user.id).then((color) => {
          setBorderColor(color);
        });
      }
    }, [session]);

    return React.createElement(as, {
      ref,
      value,
      onChange,
      placeholder,
      type,
      className: `${className} border-${borderWidth} transition duration-150 ease-in-out`,
      style: {
        borderColor: `${borderColor}33`, // 20% opacity
      },
      onFocus: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        e.target.style.borderColor = borderColor; // 100% opacity
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.borderColor = `${borderColor}33`; // 20% opacity
      },
      onMouseEnter: (
        e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        e.currentTarget.style.borderColor = borderColor; // 100% opacity
      },
      onMouseLeave: (
        e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        if (e.currentTarget !== document.activeElement) {
          e.currentTarget.style.borderColor = `${borderColor}33`; // 20% opacity
        }
      },
    });
  }
);

StyledInput.displayName = "StyledInput";

export default StyledInput;
