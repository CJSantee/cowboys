import { useState } from "react";
import Button from "../../components/Button";
import WrappedModal from "../../components/WrappedModal";

export default function Wrapped() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button title="View Wrapped" onClick={() => setIsModalOpen(true)} />
      <WrappedModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}