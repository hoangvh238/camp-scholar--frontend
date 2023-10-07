import React from "react";
import Navbar from "../../Navbar/Navbar";

type LayoutProps = {
  children: any;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <Navbar />
      <div className="pt-[45px]">
      <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
