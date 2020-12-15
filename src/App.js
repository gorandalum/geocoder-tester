import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import useDebounce from "./useDebounce";

const baseURL = "https://api.dev.entur.io/geocoder/v1/autocomplete?";

const locations = {
  orkanger: { lat: 63.30611, lon: 9.85082 },
  prinsensgate: { lat: 63.42908, lon: 10.3926 },
  flatåsen: { lat: 63.3762935, lon: 10.3378566 },
};

function App() {
  const [text, setText] = useState("Kong");
  const [size, setSize] = useState(10);
  const [lat, setLat] = useState(locations.prinsensgate.lat);
  const [lon, setLon] = useState(locations.prinsensgate.lon);
  const [weight, setWeight] = useState(15);
  const [scale, setScale] = useState("50km");
  const [fun, setFun] = useState("linear");
  const [features, setFeatures] = useState([]);

  const debouncedText = useDebounce(text, 300);

  function setLocation(key) {
    const location = locations[key];
    setLat(location.lat);
    setLon(location.lon);
  }

  useEffect(() => {
    async function getDate() {
      const res = await fetch(
        baseURL +
          new URLSearchParams({
            text,
            size,
            "focus.point.lat": lat,
            "focus.point.lon": lon,
            "focus.weight": weight,
            "focus.scale": scale,
            "focus.function": fun,
            debug: true,
          })
      );
      const results = await res.json();
      setFeatures(results.features);
    }
    getDate();
  }, [debouncedText, lat, lon, weight, scale, fun, size]);

  return (
    <main>
      <h1>Geocoder autocomplete tester</h1>
      <div>
        <label>Text:</label>
        <input
          type="text"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
        ></input>
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          value={lat}
          onChange={(ev) => setLat(ev.target.value)}
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          value={lon}
          onChange={(ev) => setLon(ev.target.value)}
        />
      </div>
      <div>
        <button onClick={() => setLocation("orkanger")}>Orkanger</button>
        <button onClick={() => setLocation("prinsensgate")}>
          Prinsens gate
        </button>
        <button onClick={() => setLocation("flatåsen")}>Flatåsen</button>
      </div>
      <div>
        <label>Focus weight:</label>
        <input
          type="number"
          value={weight}
          onChange={(ev) => setWeight(ev.target.value)}
        />
      </div>
      <div>
        <label>Focus scale:</label>
        <input
          type="text"
          value={scale}
          onChange={(ev) => setScale(ev.target.value)}
        ></input>
      </div>
      <div>
        {["50km", "200km", "2500km"].map((km) => (
          <button onClick={() => setScale(km)}>{km}</button>
        ))}
      </div>
      <div>
        <label>Focus function:</label>
        <select value={fun} onChange={(ev) => setFun(ev.target.value)}>
          <option>linear</option>
          <option>exp</option>
        </select>
      </div>
      <div>
        <label>Page size:</label>
        <select value={size} onChange={(ev) => setSize(ev.target.value)}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
      <br />
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Score</th>
            <th>Distance (km)</th>
            <th>Popularity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {features &&
            features.map((f) => (
              <tr>
                <td>{f.properties.label}</td>
                <td>{f.properties._score}</td>
                <td>{f.properties.distance}</td>
                <td>{f.properties.popularity}</td>
                <td>{f.properties.category.join(",")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
