import { Skeleton } from '@/components/ui/skeleton'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

const notitas = [
  <Skeleton className='w-full h-[40vh]' />,
  <Skeleton className='w-full h-[20vh]' />,
  <Skeleton className='w-full h-[30vh]' />,
  <Skeleton className='w-full h-[25vh]' />,
  <Skeleton className='w-full h-[15vh]' />,
  <Skeleton className='w-full h-[40vh]' />,
  <Skeleton className='w-full h-[25vh]' />,
  <Skeleton className='w-full h-[40vh]' />
]

function Loading() {
  return (
    <div className='w-full h-full'>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4 }}>
        <Masonry gutter='1rem'>
          {notitas?.map((notita, index) => (
            <div
              key={index}
              className='w-full max-h-[40vh] block rounded overflow-hidden'
            >
              {notita}
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export { Loading }