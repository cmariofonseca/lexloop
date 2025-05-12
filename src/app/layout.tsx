import './globals.css';
import Navbar from './components/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
