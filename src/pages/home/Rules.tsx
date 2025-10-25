import { useSession } from '@cjsantee/pondero-client';
import HatIcon from '../../components/HatIcon';
import useCharter from '../../hooks/queries/useCharter';
import Button from '../../components/Button';
import useAssentCharter from '../../hooks/mutations/useAssentCharter';
import VersionOne from '../../components/charter/VersionOne';
import AmmendmentThree from '../../components/charter/AmmendmentThree';

export default function Rules() {
  const { user } = useSession();
  const { data: cowboyAssents, isLoading } = useCharter();

  const assentCharter = useAssentCharter();

  if (isLoading || !cowboyAssents) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-3 mt-2 overflow-y-scroll">
      <h1 className="text-xl">The Cowboy Competition Charter</h1>
      <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <p className="text-sm italic">
          Adopted by the Five Cowboys on this day of friendly yet ruthless rivalry, February 22,
          2025
        </p>
        <VersionOne />
        <AmmendmentThree />
        <div className="mt-4 mb-8">
          <h3>Agreed and accepted:</h3>
          {cowboyAssents?.cowboys?.length > 0 &&
            cowboyAssents.cowboys.map(({ cowboy_id, name }) => (
              <div
                key={cowboy_id}
                className="flex items-center mt-2"
                style={{ fontFamily: 'cursive' }}>
                <HatIcon cowboy_id={cowboy_id} />
                <span className="ml-1">{name}</span>
              </div>
            ))}
          {user && !cowboyAssents.cowboys.some(({ user_id }) => user_id === user.user_id) && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() =>
                  assentCharter.mutate({
                    cowboy_charter_version_id: cowboyAssents.cowboy_charter_version_id,
                  })
                }
                title="Sign Charter"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
