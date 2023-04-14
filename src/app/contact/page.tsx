import React from 'react';
import Contact from '../../components/contactView/ContactView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Soye의 연락처',
};

const page = () => {
  return (
    <main className="flex justify-center">
      <Contact />
    </main>
  );
};

export default page;
