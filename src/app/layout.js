import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Interview Mentor",
  description: "AI-powered learning assistant for aptitude and coding",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-black text-black dark:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
