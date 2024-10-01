import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { LineChart, PieChart } from "../components/chart";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [loading, setloading] = useState(false);
  const [pollutants, setPollutants] = useState({});
  // Future Preference
  const [country, setCountry] = useState("-");
  const [state, setState] = useState("-");

  const [city, setCity] = useState("bhopal");
  const [cityAqi, setCityAqi] = useState("");
  const [newCity, setNewCity] = useState("bhopal");
  const [lastCity, setLastCity] = useState("bhopal");
  const [weather, setWeather] = useState({
    temp: "",
    humidity: "",
  });

  // AQI calculation functions
  const calculateAQI = (pollutantConcentration, breakpoints) => {
    const { C_low, C_high, I_low, I_high } = breakpoints;

    return (
      ((I_high - I_low) / (C_high - C_low)) * (pollutantConcentration - C_low) +
      I_low
    );
  };

  const getAQIBreakpoints = (pollutant, concentration) => {
    const breakpoints = {
      pm25: [
        { C_low: 0, C_high: 12, I_low: 0, I_high: 50 },
        { C_low: 12.1, C_high: 35.4, I_low: 51, I_high: 100 },
        { C_low: 35.5, C_high: 55.4, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
      pm10: [
        { C_low: 0, C_high: 54, I_low: 0, I_high: 50 },
        { C_low: 55, C_high: 154, I_low: 51, I_high: 100 },
        { C_low: 155, C_high: 254, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
      no2: [
        { C_low: 0, C_high: 53, I_low: 0, I_high: 50 },
        { C_low: 54, C_high: 100, I_low: 51, I_high: 100 },
        { C_low: 101, C_high: 360, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
      so2: [
        { C_low: 0, C_high: 35, I_low: 0, I_high: 50 },
        { C_low: 36, C_high: 75, I_low: 51, I_high: 100 },
        { C_low: 76, C_high: 185, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
      co: [
        { C_low: 0, C_high: 4.4, I_low: 0, I_high: 50 },
        { C_low: 4.5, C_high: 9.4, I_low: 51, I_high: 100 },
        { C_low: 9.5, C_high: 12.4, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
      o3: [
        { C_low: 0, C_high: 54, I_low: 0, I_high: 50 },
        { C_low: 55, C_high: 70, I_low: 51, I_high: 100 },
        { C_low: 71, C_high: 85, I_low: 101, I_high: 150 },
        // Add more ranges as per AQI scale
      ],
    };

    // Find the correct range for the pollutant concentration
    const bp = breakpoints[pollutant].find(
      (range) => concentration >= range.C_low && concentration <= range.C_high
    );

    return bp;
  };

  const calculateOverallAQI = (pollutants) => {
    let highestAQI = 0;

    // Loop through all pollutants and calculate their respective AQIs
    Object.keys(pollutants).forEach((pollutant) => {
      const concentration = pollutants[pollutant];
      const breakpoints = getAQIBreakpoints(pollutant, concentration);

      if (breakpoints) {
        const aqi = calculateAQI(concentration, breakpoints);
        if (aqi > highestAQI) {
          highestAQI = aqi;
        }
      }
    });

    return highestAQI;
  };

  const fetchAqiData = async () => {
    if (newCity) {
      setloading(true);
      try {
        const { data } = await axios.get(
          `https://aqi-backend.vercel.app/aqi/${country}/${state}/${newCity}`
        );

        // Check if data from API is valid or contains pollutant data
        if (
          data &&
          (data.pm25 || data.pm10 || data.so2 || data.co || data.o3 || data.no2)
        ) {
          setPollutants({
            pm25: data.pm25 || 0,
            pm10: data.pm10 || 0,
            so2: data.so2 || 0,
            co: data.co || 0,
            o3: data.o3 || 0,
            no2: data.no2 || 0,
          });
          setLastCity(newCity);
          setCity(newCity);
          toast.success("City Fetched Successfully");
        } else {
          throw new Error("Invalid data");
        }
      } catch (error) {
        toast.error("City Not Found. Showing last searched city data.");
        setNewCity(lastCity);
        setPollutants(pollutants); 
        console.error("Error fetching AQI data:", error);
      } finally {
        setloading(false);
      }
    }
  };

  // Fetch AQI data on first render or when country, state, or city changes
  useEffect(() => {
    fetchAqiData();
  }, []);

  useEffect(() => {
    if (pollutants) {
      setloading(true);
      const overallAQI = calculateOverallAQI(pollutants);
      setCityAqi(overallAQI);
      setloading(false);
    }
  }, [pollutants]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <Bar city={newCity} setCity={setNewCity} fetchAqiData={fetchAqiData} />
        {loading ? (
          <Loader />
        ) : (
          <div className="aqicnt">
            <section className="widget-container">
              <WidgetItem
                data={[
                  pollutants?.pm25,
                  pollutants?.co,
                  pollutants?.o3,
                  pollutants?.so2,
                  pollutants?.no2,
                  pollutants?.pm10,
                ]}
                heading={`${city}`} 
                aqi={typeof cityAqi === "number" ? cityAqi.toFixed(2) : "N/A"}
              />
            </section>
            <section className="mapContainer">
              <div className="HomeCard">
                <div className="header">
                  <h3>
                    <FaLocationArrow />
                    {`${city}`}
                  </h3>
                </div>
                <div className="maindata">
                  <div className="graph">
                    <CircularProgressbar
                      value={
                        typeof cityAqi === "number" ? cityAqi.toFixed(2) : "N/A"
                      }
                      text={
                        typeof cityAqi === "number" ? cityAqi.toFixed(2) : "N/A"
                      }
                      styles={buildStyles({
                        trailColor: "#e6e6e6",
                      })}
                    />
                  </div>
                  <div className="data">
                    {pollutants && (
                      <>
                        <AqiLevel
                          value={pollutants.pm25}
                          unit="ug/m^2"
                          parameter="PM 2.5"
                          color={"#21ed15"}
                        />
                        <AqiLevel
                          value={pollutants.co}
                          unit="ug/m^2"
                          parameter="CO"
                          color={"#f2f11f"}
                        />
                        <AqiLevel
                          value={pollutants.no2}
                          unit="ug/m^2"
                          parameter="NO2"
                          color={"#fe714d"}
                        />
                        <AqiLevel
                          value={pollutants.pm10}
                          unit="ug/m^2"
                          parameter="PM10"
                          color={"#FFC0CB"}
                        />
                        <AqiLevel
                          value={pollutants.so2}
                          unit="ug/m^2"
                          parameter="SO2"
                          color={"#de4df3"}
                        />
                        <AqiLevel
                          value={pollutants.o3}
                          unit="ug/m^2"
                          parameter="O3"
                          color={"#da0e26"}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="linegraphdata"></div>
                <div className="piechartdata">
                  <PieChart
                    data={[
                      pollutants?.pm25,
                      pollutants?.no2,
                      pollutants?.pm10,
                      pollutants?.so2,
                      pollutants?.o3,
                    ]}
                    labels={["PM 2.5", "NO2", "PM10", "SO2", "O3"]}
                    backgroundColor={[
                      "#21ed15",
                      "#f2f11f",
                      "#fe714d",
                      "#FFC0CB",
                      "#de4df3",
                      "#da0e26",
                    ]}
                    borderColor={"blue"}
                  />
                </div>
                <div className="linechartdata">
                  <LineChart
                    data={[
                      pollutants?.pm25,
                      pollutants?.no2,
                      pollutants?.pm10,
                      pollutants?.so2,
                      pollutants?.o3,
                    ]}
                    legend="true"
                    labels={["PM 2.5", "NO2", "PM10", "SO2", "O3"]}
                    backgroundColor={"#f8000087"}
                    borderColor={"blue"}
                    label={"Pollutants Level"}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export const AqiLevel = ({ value, unit, parameter, color, max = 100 }) => {
  return (
    <div className="aqiLevel">
      <ProgressBar
        bgColor={color}
        completed={value}
        className="wrapper"
        maxCompleted={max}
        customLabel=" "
      />
      <h3>
        {value} {unit}
      </h3>
      <p>{parameter}</p>
    </div>
  );
};

export const WidgetItem = ({ heading, aqi }) => {
  let pathColor = "";
  let aqiLevel = "";

  if (aqi >= 401 && aqi <= 500) {
    pathColor = "#da0e26";
    aqiLevel = "Hazardous";
  } else if (aqi >= 301 && aqi <= 400) {
    pathColor = "#de4df3";
    aqiLevel = "Severe";
  } else if (aqi >= 201 && aqi <= 300) {
    pathColor = "#FFC0CB";
    aqiLevel = "Unhealthy";
  } else if (aqi >= 101 && aqi <= 200) {
    pathColor = "#fe714d";
    aqiLevel = "Poor";
  } else if (aqi >= 51 && aqi <= 100) {
    pathColor = "#f2f11f";
    aqiLevel = "Moderate";
  } else {
    pathColor = "#21ed15";
    aqiLevel = "Good";
  }

  let emoji = "";
  if (aqiLevel === "Hazardous" || aqiLevel === "Severe") {
    emoji = "❗️"; // Exclamation emoji for hazardous and severe levels
  } else {
    emoji = "😊"; // Smiley emoji for other levels
  }

  return (
    <article className="widget">
      <div>
        <h4>{heading}</h4>
      </div>
      <CircularProgressbar
        value={aqi}
        text={`${aqi}`}
        maxValue={350}
        styles={buildStyles({
          pathColor: pathColor,
          textColor: pathColor,
          trailColor: "#e6e6e6",
        })}
      />
      <div
        className="aqi-level"
        style={{
          color: pathColor,
        }}
      >
        {aqiLevel}
      </div>
      <p>
        {emoji} Let&apos;s take a breath of fresh air! Keep track of Air Quality
        for a healthier life. {emoji}
      </p>
      <p>
        <span style={{ color: pathColor }}>Health Impact:</span>{" "}
        {getHealthImpact(aqiLevel)}
      </p>
    </article>
  );
};

export default Dashboard;

function getHealthImpact(aqiLevel) {
  switch (aqiLevel) {
    case "Hazardous":
      return "Avoid outdoor activities and stay indoors.";
    case "Severe":
      return "Limit outdoor activities, especially if you have respiratory issues.";
    case "Unhealthy":
      return "Sensitive individuals may experience health effects; everyone should limit prolonged outdoor exertion.";
    case "Poor":
      return "Some individuals may experience health effects; sensitive groups may experience more serious effects.";
    case "Moderate":
      return "Air quality is acceptable; however, there may be some health concern for a small number of people who are unusually sensitive to air pollution.";
    case "Good":
      return "Air quality is satisfactory, and air pollution poses little or no risk.";
    default:
      return "";
  }
}

// http://api.airvisual.com/v2/countries?key={{YOUR_API_KEY}}
