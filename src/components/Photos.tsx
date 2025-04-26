import { Spinner } from "flowbite-react";
import usePhotos from "../hooks/queries/usePhotos";
import { useState } from "react";
import Image from "./Image";

export default function Photos() {
  const { data: photos, isLoading } = usePhotos();
  const [photoIndex, setPhotoIndex] = useState(0);

  if(!photos?.length || isLoading) {
    return <Spinner />
  }
  const hasPrevious = photoIndex > 0;
  const hasNext = photoIndex < photos.length - 1;

  const previousPhoto = () => {
    if(!hasPrevious) {
      return;
    }
    setPhotoIndex(photoIndex - 1);
  }

  const nextPhoto = () => {
    if(!hasNext) {
      return;
    }
    setPhotoIndex(photoIndex + 1);
  }

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <h1>Recent Photos</h1>
      <Image url={photos[photoIndex].url} cowboys={photos[photoIndex].cowboys} />
      <div className="flex w-full justify-between py-2">
        <Button title="Previous" onClick={previousPhoto} disabled={!hasPrevious} />
        <Button title="Next" onClick={nextPhoto} disabled={!hasNext} />
      </div>
    </div>
  )
}

interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled: boolean;
}
function Button({ title, onClick, disabled }: ButtonProps) {
  return (
    <button className="rounded-lg px-2 py-1 text-white bg-gray-900 disabled:bg-gray-600" onClick={onClick} disabled={disabled}>{title}</button>
  )
}