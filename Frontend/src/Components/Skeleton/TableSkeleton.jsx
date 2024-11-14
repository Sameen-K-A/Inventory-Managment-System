import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableSkeleton = () => {
   return (
      <SkeletonTheme baseColor="#f2f2f2" highlightColor="#bfbfbf">
         <div className='mt-5'>
            <Skeleton height={50} />
            {Array(5).fill().map(() => (
               <Skeleton height={30} />
            ))}
         </div>
      </SkeletonTheme>
   );
};

export default TableSkeleton;
