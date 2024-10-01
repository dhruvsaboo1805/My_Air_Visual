/* eslint-disable react/prop-types */
import { BsSearch } from "react-icons/bs";
// import { FaBell } from "react-icons/fa";
// import { MdGTranslate } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import GoogleTranslate from "../components/GoogleTranslate";

function Bar({ city, setCity, fetchAqiData }) {
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="bar">
      {/* Search bar for country, state, and city */}
      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter City"
        />
        <button
          onClick={fetchAqiData}
        >
          Search
        </button>
      </div>
      <article>
        <GoogleTranslate />
      </article>
    </div>
  );
}

export default Bar;
