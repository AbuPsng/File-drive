import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="h-40 bg-gray-100 mt-12 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div>FileDrive</div>

        <Link className="text-blue-400 hover:text-blue-500" href="/privacy">
          Privacy
        </Link>
        <Link className="text-blue-400 hover:text-blue-500" href="/service">
          service
        </Link>
        <Link className="text-blue-400 hover:text-blue-500" href="/about">
          About
        </Link>
      </div>
    </div>
  );
};

export default Footer;
