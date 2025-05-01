import { Spinner } from "flowbite-react";
import usePhotos from "../hooks/queries/usePhotos";
import { useState } from "react";
import Image from "./Image";
import { useSwipeable } from "react-swipeable";

export default function Photos() {
  const { data: photos, isLoading } = usePhotos();
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasPrevious = photoIndex > 0;
  const hasNext = photos && photoIndex < photos.length - 1;

  const previousPhoto = () => {
    if (!hasPrevious) {
      return;
    }
    setPhotoIndex(photoIndex - 1);
  };

  const nextPhoto = () => {
    if (!hasNext) {
      return;
    }
    setPhotoIndex(photoIndex + 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextPhoto(),
    onSwipedRight: () => previousPhoto(),
  });

  if (!photos?.length || isLoading) {
    return <Spinner />;
  }

  return (
    <div {...handlers} className="h-full px-5">
      <Image
        url={photos[photoIndex].url}
        cowboys={photos[photoIndex].cowboys}
      />
      <div className="flex justify-center items-center text-sm mt-2">
        <p>Swipe to view more photos</p>
      </div>
    </div>
  );
}
