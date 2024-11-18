import React from "react";
import Image from "next/image";

const Topbar = () => {
  return (
    <div className="h-2/6 fixed mx-10 md:mx-16 my-8 ">
      <div className="flex justify-between"> 
        <h1 className="text-3xl font-mono">HelperBot</h1>
        <Image src="/icons/home.svg" width={40} height={40} alt="HomeImage" className="ml-96" />
      </div>
    </div>
  );
};

export default Topbar;
