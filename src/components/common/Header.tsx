import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 flex justify-around items-center pl-2 pr-2 pt-5 pb-5">
      <h1 className="text-gray-300 md:text-xl lg:text-2xl font-bold">
        <Link href="/">
          <span className=" text-yellow-500">Soyeah</span> Blog
        </Link>
      </h1>
      <nav>
        <ul className="flex ">
          <li className="text-gray-300">
            <Link href="/">Home</Link>
          </li>
          <li className="text-gray-300 ml-8">
            <Link href="/posts">Posts</Link>
          </li>
          {/* <li className="text-gray-300 ml-8">
            <Link href="/admin">Admin</Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
