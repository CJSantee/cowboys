import {
  ComposableMap,
  Geographies,
  Geography,
  // Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function States({ states }: { states: { state: string; name: string; latitude: number; longitude: number }[] }) {

  const stateNames = states.map(({ name }) => name);

  return (
    <div className="relative max-w-[800px] h-full flex flex-col items-center justify-center px-5">
      <div className="absolute top-0 left-0 right-0 z-10 text-center pointer-events-none">
        <h2 className="text-3xl font-bold mb-2">The cowboys took photos in</h2>
        <span className="text-6xl font-black leading-none text-[#E42A1D]">
          {states.length}
        </span>
        <h2 className="text-3xl font-bold mt-2">states this year</h2>
      </div>
      <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={stateNames.includes(geo.properties.name) ? "#fdba74" : "#F9FAFB"}
                stroke="var(--color-amber-700)"
              />
            ))
          }
        </Geographies>
        {/* {states.map(({ state, latitude, longitude }) => (
          <Marker key={state} coordinates={[longitude, latitude]} id={state}>
            <circle r={15} fill="#E42A1D" stroke="#F9FAFB" strokeWidth={2} />
          </Marker>
        ))} */}
      </ComposableMap>
    </div>
  );
}
