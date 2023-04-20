import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 flex justify-around items-center pl-16 pr-16 pt-5 pb-5 pr">
      <h1 className="text-gray-300 text-2xl font-bold">
        <Link href="/">
          <span className=" text-yellow-500">Soyeah</span> Blog
        </Link>
      </h1>
      <nav>
        <ul className="flex">
          <li className="text-gray-300 ml-8">
            <Link href="/">Home</Link>
          </li>
          <li className="text-gray-300 ml-8">
            <Link href="/posts">Posts</Link>
          </li>
          <li className="text-gray-300 ml-8">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
