import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoader() {
  return (
    <SkeletonTheme baseColor="#cccccc" >
    
    <p>
      <Skeleton count={6}  enableAnimation={true} height={50}/>
    </p>
    </SkeletonTheme>
  )
}

export default SkeletonLoader