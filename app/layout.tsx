import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import ContextWrapper from "./context/ContextWrapper";
import { UserProvider } from "./components/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wenceslaus Project",
  description: "My Final Year Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextWrapper>
          <UserProvider>
            <div className="landingpage">
              <div className="h-full w-full bg-gray-100">
                <Nav />
                <div className="">{children}</div>
              </div>
            </div>
          </UserProvider>
        </ContextWrapper>
      </body>
    </html>
  );
}
