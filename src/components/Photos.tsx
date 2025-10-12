import { Spinner } from 'flowbite-react';
import usePhotos from '../hooks/queries/usePhotos';
import { useState, useEffect, useCallback } from 'react';
import Image from './Image';
import { useSwipeable } from 'react-swipeable';

export default function Photos() {
  const { data: photos, isLoading } = usePhotos();
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasPrevious = photoIndex > 0;
  const hasNext = photos && photoIndex < photos.length - 1;

  const previousPhoto = useCallback(() => {
    if (!hasPrevious) {
      return;
    }
    setPhotoIndex((prevIndex) => prevIndex - 1);
  }, [hasPrevious]);

  const nextPhoto = useCallback(() => {
    if (!hasNext) {
      return;
    }
    setPhotoIndex((prevIndex) => prevIndex + 1);
  }, [hasNext]);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextPhoto(),
    onSwipedRight: () => previousPhoto(),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photoIndex, nextPhoto, previousPhoto]);

  if (!photos?.length || isLoading) {
    return <Spinner />;
  }

  return (
    <div {...handlers} className="h-full px-5">
      <Image
        url={photos[photoIndex].url}
        alt={photos[photoIndex].alt_photos?.[0]}
        cowboys={photos[photoIndex].cowboys}
        date={photos[photoIndex].score_date}
      />
      <div className="flex justify-center items-center text-sm mt-2">
        <p>Swipe to view more photos</p>
      </div>
    </div>
  );
}
