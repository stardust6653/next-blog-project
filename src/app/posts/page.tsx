import React from 'react';
import { getFilteredData } from '../../controller/CRUD';
import PostCard from '../../components/home/PostCard';
import { Metadata } from 'next';
import FilterTap from '../../components/FilterTap';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'All Posts',
};

const page = async () => {
  const data = await getFilteredData('desc');

  return (
    <section className="flex justify-center mt-8 w-full mb-10">
      <div className="flex flex-col items-center md:w-12/12 lg:w-9/12 xl:w-8/12 ">
        <h2 className="text-4xl font-bold">Post</h2>
        <FilterTap />
        <div className="flex flex-wrap justify-center">
          {data.map((item, i) => {
            return (
              <PostCard
                key={i}
                previewSrc={item.previewImg}
                title={item.title}
                description={item.description}
                date={item.date}
                id={String(item.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default page;
