import React from 'react';
import dynamic from 'next/dynamic';
import { getDescFilteredData } from '../../../controller/CRUD';
import Image from 'next/image';
import { Metadata } from 'next';

const MarkDownViewer = dynamic(() => import('../../../components/viewer/MarkDownViewer'), {
  ssr: false,
});

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getDescFilteredData();
  const currentData = data.filter((item) => String(item.id) === params.slug);

  return {
    title: currentData[0].title,
    description: currentData[0].description,
  };
}

const page = async ({ params }: Props) => {
  const data = await getDescFilteredData();

  const currentData = data.filter((item) => String(item.id) === params.slug);

  return (
    <div className="flex justify-center overflow-scroll">
      <article className="sm: w-11/12 m-5 xl:w-7/12 mt-12 mb-12">
        <h1 className="sm: text-3xl xl:text-5xl font-bold mb-6">{currentData[0].title}</h1>
        <p className="mb-4 text-end">발행일 : {currentData[0].date}</p>
        <Image
          src={currentData[0].previewImg}
          alt=""
          width="320"
          height="208"
          placeholder="blur"
          blurDataURL={currentData[0].previewImg}
          style={{ objectFit: 'cover' }}
          className="shadow-md rounded-xl overflow-hidden bg-no-repeat h-52 bg-center"
        />
        <MarkDownViewer html={currentData[0].html} />
      </article>
    </div>
  );
};

export default page;
