/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import good from "../../assets/good.webp";
import hazard from "../../assets/hazard.webp";
import moderate from "../../assets/moderate.webp";
import poor from "../../assets/poor.webp";
import severe from "../../assets/severe.webp";
import un_healthy from "../../assets/un_healthy.webp";

const AqiIndex = () => {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="aqiIndex">
				<h2>Air Quality Index</h2>
				<p>Know about the category of air quality index (AQI) your ambient air falls in and what it implies.</p>
				<div className="aqiContainer">
					<AqiCard
						range="0 - 50"
						text="The air is fresh and free from toxins. People are not exposed to any health risk."
						level="Good"
						img={good}
						color="#21ed15"
					/>
					<AqiCard
						range="51 - 100"
						text="Acceptable air quality for healthy adults but mild threat to sensitive individuals."
						level="Moderate"
						img={moderate}
						color="#f2f11f"
					/>
					<AqiCard
						range="101 - 200"
						text="Inhaling such air can cause slight discomfort and difficulty in breathing."
						level="Poor"
						img={poor}
						color="#fe714d"
					/>
					<AqiCard
						range="201 - 300"
						text="This could be typically problematic for children, pregnant women and the elderly."
						level="Unhealthy"
						img={un_healthy}
						color="#FFC0CB"
					/>
					<AqiCard
						range="301 - 400"
						text="Exposure to air can cause chronic morbidities or even organ impairment."
						level="Severe"
						img={severe}
						color="#de4df3"
					/>
					<AqiCard
						range="401 - 500"
						text="Beware! Your life is in danger. Prolonged exposure can lead to premature death."
						level="Hazardious"
						img={hazard}
						color="#da0e26"
					/>
				</div>
			</main>
		</div>
	);
};

export default AqiIndex;

const AqiCard = ({ img, range, text, color, level }) => {
	return (
		<div className="aqiCard" style={{ backgroundColor: color }}>
			<img src={img} />
			<h3>
				{level} <span> {range} </span>
			</h3>
			<p>{text}</p>
		</div>
	);
};
