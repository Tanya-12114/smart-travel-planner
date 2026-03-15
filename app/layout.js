// app/layout.js
import "./globals.css";
import Sidebar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata = {
  title: "Voyagr — Smart Travel Planner",
  description: "Plan your dream trip with an AI-powered itinerary builder, budget tracker, and live weather.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-paper">
        <AuthProvider>
          <Sidebar />
          <main className="ml-[220px] flex-1 min-h-screen lg:ml-[220px] md:ml-[60px]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}