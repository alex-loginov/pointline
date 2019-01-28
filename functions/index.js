$(document).ready(function() {
	var myMap;
	ymaps.ready(build_map);


	$('#form-1').submit(function(e) {
		e.preventDefault();
		var fd = new FormData;
		
		var fileInput = $(this).find('[name=userfile]').prop('files')[0];
		var fileInputName = fileInput.name;
		fd.append('file', fileInput);
		plotting(fileInputName);		
		function plotting(fileInputName){
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
					//console.log({ towers });
					
					//init(towers);
					//var lines = getBrokenLines(towers);
					//lines.forEach(addLines);
					//console.log('lines', lines);
					//console.log({fileInputName});
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
 		//console.log('outputDistance: >>');
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
		console.log(lines);
		return lines;
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
		//console.log({res});
		var distance = res.reduce(function(distance, re) {
			return distance + addLines(re);
		}, 0);
		return distance;
	}
	function build_map(){
		myMap = new ymaps.Map("map", {
			center: [56.309319, 43.962170],
			zoom: 14,
		});
	}


	function check_distances(conns, towers){

		var distanceMass = outputDistance(conns, towers);
		console.log({distanceMass});

		var averageDistances = distanceMass.map(function(line) {

			return line.reduce(function(distance, tower) {
				return distance + tower.distance;
			}, 0) / line.length;

		});

		console.log({averageDistances});

		// for(var i = 0; i <= distanceMass.length; i++){
		// 	var part = distanceMass[i];
		// 	console.log({part});
		// 	//var sumPart = part.reduce((sum, ) => );
		// 	var sumPart = 0;
		// 	for(var q =0; q < part.length; q++){
		// 		var dist = part[q];
		// 		console.log({dist});
		// 		//var dists = JSON.parse(part[q]);
		// 		//console.log({dists});
		// 		sumPart += dist.distance;
		// 		console.log({sumPart});
		// 	}

		// 	var sredDist = sumPart/part.length;
		// 	console.log(sredDist);
		// }

	}


	function init(conns, towers, fileInputName) {  
		polylineCollection = new ymaps.GeoObjectCollection();
		var lines = getBrokenLines(towers);

		outputDistance(conns, towers);

		var distanceLine = lines.reduce(function(distance, line) {
			return distance + addLines(line);
		}, 0);
		var distanceConn = build_conn(conns, towers);
		var totalDistance = distanceLine + distanceConn;
		//console.log(totalDistance);
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
				tower.lat = newCoords[0];
				tower.lon = newCoords[1];
				//console.log(`Новые коорд: ${tower.lat} ${tower.lon}!`);
				polylineCollection.removeAll()		
				var lines = getBrokenLines(towers);
				
				// lines.forEach(addLines);
				var distanceLine = lines.reduce(function(distance, line) {
					return distance + addLines(line);
				}, 0);
				var distanceConn = build_conn(conns, towers);
				var totalDistance = distanceLine + distanceConn;
				outputDistance(conns, towers);
				check_distances(conns, towers);
				//console.log(totalDistance);
			});

		});
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
		});

		$('#download').click(function() {
			var data = {
				fileName: fileInputName,
			};

			window.location = 'functions/' + fileInputName;

			// $.post('functions/download.php', data)
			// 	.then((data) => {

			// 		console.log('success');
			// 		//console.log(data);

			// 	}).fail((error) => {

			// 		console.log('error', { error });
			// 	});
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

	
});
		