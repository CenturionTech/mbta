// sound effects
	const busDepart = new Audio();
	const busArrival = new Audio();

	busDepart.src = "./bus_depart.wav";
	busArrival.src = "./bus_arrival.wav";	


	function playSound(sound) { 
		sound.play() 
	} 

	// access token for mapbox
	mapboxgl.accessToken = "pk.eyJ1Ijoib2NlcmRhdjY3IiwiYSI6ImNsYmVscGprcjBhd2IzdXA2OXppNnVhbWQifQ.6rkoIgcZHWxer8N6--qkqg";

	var map = new mapboxgl.Map({
  	container: 'map',
  	style: 'mapbox://styles/mapbox/streets-v11',
  	center: [-71.091542,42.358862],
  	zoom: 14
	});


	  
	let counter = 0;
	function moveBuses(){
    	setTimeout(() => {
      	if (counter >= busCoordinates.length) {
       	 counter = 0; 
       	 return};
      	playSound(busDepart);
		marker = new mapboxgl.Marker()
			.setLngLat(busCoordinates[counter])
			.addTo(map);

      	counter++;
      	playSound(busArrival);
		// console.log(busCoordinates[counter]);
      	moveBuses();
      	}, 500);
  	  }
	
	var busCoordinates = []; 

	async function run(){
		// get bus data   
		const busLocations = [];
		busCoordinates = [];
		const locations = await getBusLocations();
		// console.log(new Date());
		// console.log(locations);
		let numLocations = locations.length;
		for (let bus = 0; bus < numLocations; bus++) {
			busLocations.push(locations[bus].attributes);
			
		}
        // get bus Coordinates
		// console.log(busLocations);
		let busData = busLocations.length;
		for (let bus = 0; bus < busData; bus++) {
			busCoordinates.push([busLocations[bus].longitude, busLocations[bus].latitude]);
			
		}
		
		//console.log(busCoordinates.length);
		//console.log(busCoordinates);
		
		moveBuses();

		// timer
		setTimeout(run, 15000);
	}

	// Request bus data from MBTA
	async function getBusLocations(){
		const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
		const response = await fetch(url);
		const json     = await response.json();
		return json.data;
	}

	//run();
