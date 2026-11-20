import HatIcon from '../../components/HatIcon';
import useCharter from '../../hooks/queries/useCharter';
import VersionOne from '../../components/charter/VersionOne';
import AmmendmentThree from '../../components/charter/AmmendmentThree';

export default function Rules() {
  const { data: cowboyAssents, isLoading } = useCharter();

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
        </div>
      </div>
    </div>
  );
}
