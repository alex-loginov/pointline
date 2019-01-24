$(document).ready(function() {
	var myMap;

	$('#form-1').submit(function(e) {
		e.preventDefault();
		var fd = new FormData;
		
		var fileInput = $(this).find('[name=userfile]').prop('files')[0];
		var fileInputName = fileInput.name;
		console.log(fileInputName);
		fd.append('file', fileInput);
		plotting(fileInputName);		
		function plotting(fileInputName){
			console.log(fileInputName);
			$.ajax({
				url: 'functions/parseCoords.php',
				type: 'POST',
				processData: false,
				contentType: false,
				data: fd,
				async: true,
				success: function(data) {
					// console.log({ data });
					// return;
					var towers = JSON.parse(data);
					console.log({ towers });

					//init(towers);
					//var lines = getBrokenLines(towers);
					//lines.forEach(addLines);
					//console.log('lines', lines);
					console.log({fileInputName});
					building_connections(towers, fileInputName);

					//init(null, towers);

				},
				error: function(error) {
					console.log('error', error);
				},	
			});
		}
		
		function building_connections(towers, fileInputName) {
			$.ajax({
				url: 'functions/parseConn.php',
				type: 'POST',
				processData: false,
				contentType: false,
				data: fd,
				async: true,
				success: function(data) {
					// console.log({ data });
					// return;
					var conns = JSON.parse(data);
					init(conns, towers, fileInputName);
					//console.log({ conns });
					//build_conn(conns, towers);
				},
				error: function(error) {
					console.log('error', error);
				},	
			});
		}

		

	});

	// ymaps.ready(init);
 	function outputDistance(conns, towers){
 		console.log('outputDistance: >>');
 		//var coordTowerLast = 0;
 		//var flag = 0;

 		var coordTowerLast = [];
 		var coordTowerFirst = [];
		var groupTowers = _.groupBy(towers, 'idSector');
		var sortedTowers = [];
		var sectorIds = Object.keys(groupTowers);

		var lines = sectorIds.map(function (idSector, i) {
			var lenSectorIds = sectorIds.length;
			var towersByIdSector = groupTowers[idSector];
			sortedTowers = _.sortBy(towersByIdSector, ['nameSupport']);
			var lenSortedTowers = sortedTowers.length;
			var outputDistanceM = [];



			for(var i = 0; i < lenSortedTowers-1; i++){
				var coordTower1 = [sortedTowers[i].lat, sortedTowers[i].lon];
				var coordTower2 = [sortedTowers[i+1].lat, sortedTowers[i+1].lon];
				outputDistanceM.push({
					from: sortedTowers[i].nameSupport,
					to: sortedTowers[i+1].nameSupport,
					distance: getDistanceBetweenTwoTowers(coordTower1, coordTower2),
				});
			}
			
			
			return outputDistanceM;
		});
		var distConns = 0;
		var coordTower1 = [];
		var coordTower2 = [];
		var nameTower1 = [];
		var nameTower2 = [];
		var row = [];
		var res = [];
		// var outputDistanceM1 = [];
		lines = lines.concat([conns.map(function(conn){
			// console.log({test1: JSON.parse(JSON.stringify(outputDistanceM1))});
			towers.forEach(function(tower){
				
				if (tower.idSupport == conn[1]){

					coordTower1 = [tower.lat,tower.lon];
					nameTower1 = tower.nameSupport;

				}
				if (tower.idSupport == conn[2]){
					coordTower2 = [tower.lat,tower.lon];
					nameTower2 = tower.nameSupport;
				}
				
			});
			
			// outputDistanceM1.push();

			return {
				from: nameTower1,
				to: nameTower2,
				distance: getDistanceBetweenTwoTowers(coordTower1, coordTower2),
			};
		})]);
		//преобразование двумерного массива Line в дномерный массива 
		// var sLines = [];
		// for (var i = 0; i < lines.length;i++){
		// 	var linesRow = lines[i];
		// 	console.log({linesRow});
		// 	for (var q = 0; q < linesRow.length; q++){
		// 		console.log('linesRow[q]:',linesRow[q]);

		// 		sLines.push(linesRow[q]);
		// 	}
		// }
		// console.log('!', sLines.sort((a, b) => a.from - b.from)); //сортировка массива по возрастанию
		
 	}

	function getDistanceBetweenTwoTowers(tower1, tower2){
		return ymaps.coordSystem.geo.getDistance(tower1, tower2);
	}

	function build_conn(conns, towers){
		//console.log(conns);
		var distConns = 0;
		var tower1 = [];
		var tower2 = [];
		var row = [];
		var res = [];
		conns.forEach(function(conn){
			towers.forEach(function(tower){
				if(tower.idSupport == conn[1]){
					tower1 = [tower.lat,tower.lon];
				}
				if(tower.idSupport == conn[2]){
					tower2 = [tower.lat,tower.lon];
				}
				row = [tower1,tower2];
			});
			res.push(row);

		});
		console.log({res});
		var distance = res.reduce(function(distance, re) {
			return distance + addLines(re);
		}, 0);
		return distance;
	}


	function init(conns, towers, fileInputName) {  

		console.log(fileInputName);
		
		myMap = new ymaps.Map("map", {
			center: [56.309319, 43.962170],
			zoom: 14,
		});
		polylineCollection = new ymaps.GeoObjectCollection();

		var lines = getBrokenLines(towers);
		outputDistance(conns, towers);
		// lines.forEach(addLines);
		var distanceLine = lines.reduce(function(distance, line) {
			return distance + addLines(line);
		}, 0);

		var distanceConn = build_conn(conns, towers);
		var totalDistance = distanceLine + distanceConn;
		console.log(totalDistance);
		towers.forEach(function(tower) {
			var myPlacemark = new ymaps.Placemark([tower.lat, tower.lon], {
				//balloonContent: tower.id,
				//iconCaption: tower.id,
				iconContent: tower.nameSupport,

			}, {
				preset: 'islands#blueCircleIcon',
				draggable: true

			})

			myMap.geoObjects.add(myPlacemark);
			myPlacemark.events.add('dragend', function (e) {
				//var idDragendPl = e.get('target').properties.get('balloonContent');
				var newCoords = e.get('target').geometry.getCoordinates();
				//console.log(tower.id);
				//console.log('Старые коорд: ' + tower.lat + ' ' + tower.lon);
				//console.log(`Старые коорд: ${tower.lat} ${tower.lon}!`);
				// tower.lat = newCoords[0].toPrecision(6);
				// tower.lon = newCoords[1].toPrecision(6);
				tower.lat = newCoords[0];
				tower.lon = newCoords[1];
				//console.log(`Новые коорд: ${tower.lat} ${tower.lon}!`);
				polylineCollection.removeAll()		
				var lines = getBrokenLines(towers);
				
				// lines.forEach(addLines);
				var distanceLine = lines.reduce(function(distance, line) {
					return distance + addLines(line);
				}, 0);

				//console.log({distance});

				var distanceConn = build_conn(conns, towers);
				var totalDistance = distanceLine + distanceConn;
				//console.log(summDist);
				console.log(totalDistance);
				//console.log({distance1});


			});

		});
		//myMap.setBounds(myPlacemark.geometry.getBounds());
		console.log(fileInputName);
		$('#saveRes').click(function() {

			var data = {
				fileName: fileInputName,
				towers,
			};

			$.post('functions/saveFile.php', data)
				.then((data) => {

					console.log('success');
					console.log(data);

				}).fail((error) => {

					console.log('error', { error });

				});

			// $.post('./saveFile.php', {
			// 	fileName: fileInputName,
			// 	towers: towers,
			// }, function(data) {
			// 	console.log('result', { data });
			// 	return;
			// 	//var towers = JSON.parse(data);
			// 	//console.log({ towers });

			// 	//init(towers);
			// 	//var lines = getBrokenLines(towers);
			// 	//lines.forEach(addLines);
			// 	//console.log('lines', lines);
			// 	//building_connections(towers);
			// 	//init(null, towers);

			// }, function(error) {
			// 	console.log('error', error);
			// });
		});
	}
	
	function getBrokenLines(allTowers) {

		var groupTowers = _.groupBy(allTowers, 'idSector');
		var lines = Object.keys(groupTowers).map(function (idSector){
			var towersByIdSector = groupTowers[idSector];
			var sortedTowers = _.sortBy(towersByIdSector, ['nameSupport']);
			var line = sortedTowers.map(function(tower) {
				return [tower.lat, tower.lon];
			});
			return line;
		});
		//console.log(lines);
		return lines;

	}

	function addLines(line) {
		var distPolyline = 0;

		var lineString = new ymaps.geometry.LineString(line);
    	var geoObject = new ymaps.GeoObject({ geometry: lineString });
    	polylineCollection.add(geoObject);
	    myMap.geoObjects.add(polylineCollection);
	    var a = polylineCollection.toArray();
	    //console.log(a);
	    var distance = geoObject.geometry.getDistance();
    	//console.log(Polyline);
	    //distPolyline = myPolyline.geometry.getDistance();
	    return distance;
	    //myMap.setBounds(myPolyline.geometry.getBounds());
	}


	function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}

	const distanceMOWBKK = getDistanceFromLatLonInKm(
	  55.45, 37.36, 13.45, 100.30
	);

	

	

	// function renderCoords(coords) {

	// 	var map = new ol.Map({
	//	   	target: 'map',
	//	   	layers:[
	//	   		new ol.layer.Tile({
	//	   			source: new ol.source.OSM()
	//	   		})
	//	   	],
	//	   	view: new ol.View({
	//	   		center: ol.proj.fromLonLat([37.41, 8.82]),
	//	   		zoom: 4
	//	   	}),
	//	   });

	// 	var point_feature = new ol.Feature({});

	// 	coords.forEach((coord) => {
	// 		var lat = coord.lat;
	// 		var lon = coord.lon;
	// 		console.log({lat,lon});
	// 		var point_geom = new ol.geom.Point(ol.proj.transform((lon, lat), 'EPSG:3857', 'EPSG:4326'));
	// 		point_feature.setGeometry(point_geom);
	// 	});
		

	// 	var vector_layer = new ol.layer.Vector({
	// 	  source: new ol.source.Vector({
	// 		features: [point_feature]
	// 	  })
	// 	})

	// 	map.addLayer(vector_layer);
	// 	var fill = new ol.style.Fill({
	// 	  color: [180, 0, 0, 0.3]
	// 	});
		
	// 	var stroke = new ol.style.Stroke({
	// 	  color: [180, 0, 0, 1],
	// 	  width: 1
	// 	});
	// 	var style = new ol.style.Style({
	// 	  image: new ol.style.Circle({
	// 		fill: fill,
	// 		stroke: stroke,
	// 		radius: 8
	// 	  }),
	// 	});
	// 	vector_layer.setStyle(style);

	// }

  	
});
		