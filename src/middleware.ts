// export { auth as middleware } from "@/auth";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/app/:path*", "/other/:path*", "/help/:path*"],
};
