import { useEffect, useState } from 'react';
import Button from '../components/Button';
import FileInput from '../components/FileInput';
import Image from '../components/Image';
import { api, useSession } from '@cjsantee/pondero-client';
import Datepicker from '../components/Datepicker';
import CowboySelect from '../components/CowboySelect';
import ProgressBar from '../components/ProgressBar';
import { convertDate } from '../utils';
import useCowboys from '../hooks/queries/useCowboys';
import { useNavigate } from 'react-router';
import { CowboyId } from '../types';

export default function Submit() {
  const [date, setDate] = useState<null | Date>(new Date());
  const [file, setFile] = useState<null | File>(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCowboyIds, setSelectedCowboyIds] = useState<CowboyId[]>([]);
  const { access_token } = useSession();
  const { data: cowboys } = useCowboys();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files?.length) {
      return;
    }
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    setFile(file);
    setPreview(objectUrl);
  };

  const onSubmit = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    // Add selected cowboys
    formData.append('cowboys', selectedCowboyIds.join(','));
    // Add the selected score date
    formData.append('score_date', convertDate(date || new Date()));
    setUploading(true);
    const { success } = await api.upload('/cowboys/photos', formData, {
      access_token,
    });
    if (success) {
      navigate('/');
    }
    setUploading(false);
  };

  const selectedCowboys = selectedCowboyIds
    .map((id) => cowboys?.find((c) => c.cowboy_id === id))
    .filter(Boolean)
    .map((c) => ({
      cowboy_id: c?.cowboy_id || (0 as CowboyId),
      nickname: c?.nickname || '',
      points: 1,
    }));

  return (
    <div className="flex flex-col grow items-center justify-between p-3">
      <div className="flex items-center justify-between w-full">
        <h1>{date?.toDateString()}</h1>
        <Button
          onClick={() => setShowDatepicker(!showDatepicker)}
          title={showDatepicker ? 'Confirm Date' : 'Change Date'}
          size="sm"
        />
      </div>
      {showDatepicker ? (
        <Datepicker value={date} onChange={setDate} />
      ) : preview ? (
        <Image
          url={preview}
          date={convertDate(date || new Date())}
          cowboys={selectedCowboys}
          is_public={false}
        />
      ) : (
        <FileInput onChange={onFileChange} />
      )}
      <CowboySelect value={selectedCowboyIds} onChange={setSelectedCowboyIds} />
      {file &&
        (uploading ? (
          <ProgressBar duration_ms={5000} />
        ) : (
          <Button onClick={onSubmit} title="Submit" />
        ))}
    </div>
  );
}
