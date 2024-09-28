import React,{useState} from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

const LayOut = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content area */}
      <div className="relative bg-cover bg-center bg-[url(https://images.pexels.com/photos/13621287/pexels-photo-13621287.jpeg?auto=compress&cs=tinysrgb&h=204&fit=crop&w=228&dpr=2)] flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow px-2 my-2">{children}</main>

        {/* <Banner /> */}
      </div>
    </div>
  );
};

export default LayOut;
