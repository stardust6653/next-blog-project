'use client';

import React, { useState } from 'react';
import { BiCheckbox, BiCheckboxSquare } from 'react-icons/bi';

const FilterTap = () => {
  const [filterType, setFilterType] = useState('desc');

  const setDesc = () => {
    setFilterType('desc');
  };

  const setAsc = () => {
    setFilterType('asc');
  };

  const filterIcon = (filterType: string, type: string) => {
    if (filterType === type) return <BiCheckboxSquare />;
    return <BiCheckbox />;
  };

  return (
    <>
      <div className="flex justify-end items-center w-10/12 h-10">
        <div className="flex cursor-pointer" onClick={setDesc}>
          {filterIcon(filterType, 'desc')}
          <span>최신 순</span>
        </div>
        <div className="flex cursor-pointer ml-3" onClick={setAsc}>
          {filterIcon(filterType, 'asc')}
          <span>오래된 순</span>
        </div>
      </div>
    </>
  );
};

export default FilterTap;
