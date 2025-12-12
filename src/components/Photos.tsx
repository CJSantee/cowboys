import usePhotos from '../hooks/queries/usePhotos';
import { useState, useEffect, useCallback } from 'react';
import Image from './Image';
import { useSwipeable } from 'react-swipeable';
import Loading from './Loading';
import CowboyPhoto from './CowboyPhoto';
import { isCompetitionOver } from '../utils';
import clsx from 'clsx';

export default function Photos() {
  const { data: photos, isLoading } = usePhotos();
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasPrevious = photoIndex > 0;
  const hasNext = photos && photoIndex < photos.length - 1;
  const view: 'grid' | 'carousel' = isCompetitionOver() ? 'grid' : 'carousel';

  const previousPhoto = useCallback(() => {
    if (!hasPrevious || view !== 'carousel') {
      return;
    }
    setPhotoIndex((prevIndex) => prevIndex - 1);
  }, [hasPrevious, view]);
  const nextPhoto = useCallback(() => {
    if (!hasNext || view !== 'carousel') {
      return;
    }
    setPhotoIndex((prevIndex) => prevIndex + 1);
  }, [hasNext, view]);

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
    return <Loading />;
  }

  return (
    <div {...handlers} className={clsx('h-full', view === 'carousel' ? 'px-5' : 'px-1')}>
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {photos.map((photo, index) => (
            <CowboyPhoto
              key={`photo-${index}`}
              cowboy_id={photo.cowboys.length > 0 ? photo.cowboys[0].cowboy_id : null}
              photo={{
                alt_photos: [],
                points: photo.cowboys.reduce((acc, curr) => acc + curr.points, 0),
                ...photo,
              }}
            />
          ))}
        </div>
      ) : (
        <>
          <Image
            photo_url={photos[photoIndex].photo_url}
            cowboys={photos[photoIndex].cowboys}
            date={photos[photoIndex].score_date}
            is_public={photos[photoIndex].is_public}
          />
          <div className="flex justify-center items-center text-sm mt-2">
            <p>Swipe to view more photos</p>
          </div>
        </>
      )}
    </div>
  );
}
