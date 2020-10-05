import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Background(props) {
	const [backgroundImage, setBackgroudImage] = useState("");

	// Gets photos
	useEffect(() => {
		axios
			.get(
				`https://api.unsplash.com/photos/random/?client_id=${process.env.REACT_APP_UNSPLASH}&collections=795588`
			)
			.then((resp) => {
				setBackgroudImage(resp.data.urls.full);
			})
			.catch((err) => {
				setBackgroudImage("https://source.unsplash.com/collection/795588/1600x900");
				console.log(`Error fetching photo: ${err}`);
			});
			
		// Change image every 5 minutes
		const imageInterval = setInterval(() => {
			axios
				.get(
					`https://api.unsplash.com/photos/random/?client_id=${process.env.REACT_APP_UNSPLASH}&collections=795588`
				)
				.then((resp) => {
					setBackgroudImage(resp.data.urls.full);
				})
				.catch((err) => {
					console.log(`Error fetching photo: ${err}`);
				});
		}, 1000 * 60 * 5);

		return () => {
			clearInterval(imageInterval);
		};
	}, []);

	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${backgroundImage})`,
			}}
		></div>
	);
}
