import { useNavigate } from 'react-router';
import Button from '../../components/Button';
import Photos from '../../components/Photos';
import { useSession } from '@cjsantee/pondero-client';
import { isCompetitionOver } from '../../utils';

export default function PhotosPage() {
  const navigate = useNavigate();
  const { user } = useSession();

  const competitionOver = isCompetitionOver();

  return (
    <>
      <div className="grow overflow-auto">
        <Photos />
      </div>
      {user && !competitionOver && (
        <div className="flex justify-center mt-2 min-h-content">
          <Button onClick={() => navigate('/submit')} title="Submit Photo" />
        </div>
      )}
    </>
  );
}
