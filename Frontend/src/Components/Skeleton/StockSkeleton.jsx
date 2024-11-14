import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StockSkeleton = () => {
   return (
      <SkeletonTheme baseColor="#f2f2f2" highlightColor="#bfbfbf">
         <div className='d-flex'>
            {Array(3).fill().map(() => (
               <Skeleton height={200} width={400} className='ag-courses_item' />
            ))}
         </div>
      </SkeletonTheme>
   );
};

export default StockSkeleton;