import { ThemeModeScript } from 'flowbite-react';

import Navbar from './components/navbar';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <ThemeModeScript />
      </head>

      <body className="flex flex-col h-[100dvh] w-screen overflow-hidden">
        <div className="h-[6%]">
          <Navbar />
        </div>
        <div className="h-[94%] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
