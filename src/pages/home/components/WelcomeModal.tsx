import Modal from '../../../components/Modal';
import Icon from '../../../components/Icon';
export interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}
export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 hover:text-gray-300 focus:outline-none">
        <Icon name="close" size={6} />
      </button>
      <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="text-center">
        <h2 className="text-xl font-bold">Welcome to CowboyCounter.com 🤠</h2>
        <p>
          It all started on January 12th, 2025, on the streets of Nashville, TN. Five friends and
          newly anointed hat-bearing cowboys made a pact. What began as a joke became a year-long
          competition to see who could live the cowboy life most faithfully. From dawn till dusk,
          each cowboy must don their hat and embrace the cowboy way.
        </p>
        <h4>Photos are proof.</h4>
        <h4>Points are earned.</h4>
        <h4>Pride is on the line.</h4>
        <p>
          When the dust settles, one cowboy will be crowned champion, and another will face
          humiliation.
        </p>
      </div>
    </Modal>
  );
}
