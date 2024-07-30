import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    //children은 ReactNode임
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;