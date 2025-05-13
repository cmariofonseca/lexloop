import { ThemeModeScript } from "flowbite-react";

import Navbar from "./components/navbar";

import "./globals.css";

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <ThemeModeScript />
      </head>

      <body className="flex flex-col h-[100dvh] w-screen overflow-hidden">
        <div className="h-[6%] p-1">
          <Navbar />
        </div>
        <div className="h-[94%] overflow-hidden px-4">{children}</div>
      </body>
    </html>
  );
}
