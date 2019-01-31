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
		//console.log(lines);
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

		var allDist = distanceMass.reduce(function(result, line) {

			return result.concat(line);

		}, []);

		allDist.sort(function(a, b){
			return a.distance - b.distance;
		});

		console.log({allDist});
 		var srZ = 0;
		var lenAllDist = allDist.length;
		if(lenAllDist % 2 == 0) {
			srZ = (allDist[lenAllDist/2].distance + allDist[(lenAllDist/2)+1].distance)/2;
		}else {
			srZ = allDist[Math.ceil(lenAllDist/2)].distance;
		}
		//console.log(srZ);
		anamalDist = [];
		allDist.forEach(function(dist){
			if(dist.distance < (srZ+15) && dist.distance > (srZ-15)){
				//console.log(srZ/100*115 + ' ' +srZ/100*85);
				
				//console.log({dist})
			}else{
				//console.log((srZ+15) + ' ' +(srZ-15));
				//var er = dist.distance;
				//console.log({dist})
				anamalDist.push(dist);
			}

		});
		
		var srDis = 0;
		allDist.forEach(function(disdt){
			srDis +=disdt.distance;

		});
		return anamalDist;
		//console.log(srZ);
		//console.log(srDis/lenAllDist);

		//console.log({myPlacemark});

	}


	function init(conns, towers, fileInputName) {  
		polylineCollection = new ymaps.GeoObjectCollection();
		placemarkCollection = new ymaps.GeoObjectCollection();

		var lines = getBrokenLines(towers);
		outputDistance(conns, towers);
		var distanceLine = lines.reduce(function(distance, line) {
			return distance + addLines(line);
		}, 0);
		var distanceConn = build_conn(conns, towers);
		var totalDistance = distanceLine + distanceConn;
		var element = $('#total_dist');
		generateLI(roundNumber(totalDistance, 1), element);

		var anamalDist = check_distances(conns, towers);
		//Вывод анамальных расстояний
		var distance_betwen_towers = outputDistance(conns, towers);
		distance_betwen_towers.forEach(function(line){
			line.forEach(function(dist){	
				var element = $('#distance-between-towers');
				var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
				generateLI(text, element);
			});
		});
		anamalDist.forEach(function(dist){
			var element = $('#anamal-distance-between-towers');
			var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
			generateLI(text, element);

		});
		var redTowers = [];
		anamalDist.forEach(function(dist){
			if(!redTowers.includes(dist.to)){
				redTowers.push(dist.to);
			}
			if(!redTowers.includes(dist.from)){
				redTowers.push(dist.from);
			}
		});
		//Вывод плохих опор
		redTowers.forEach(function(tower){
			var element = $('#anamal-towers');
			var text = 'Опора ' + tower;
			generateLI(text, element);
		});
		console.log(redTowers);
		console.log(anamalDist);

		towers.forEach(function(tower) {
			var myPlacemark;
			
			var colorTower = redTowers.includes(tower.nameSupport) ? 'islands#redCircleIcon' : 'islands#blueCircleIcon';

				myPlacemark = new ymaps.Placemark([tower.lat, tower.lon], {

					iconContent: tower.nameSupport,
				}, {
					preset: colorTower,
					draggable: true
				})

				placemarkCollection.add(myPlacemark);
				myMap.geoObjects.add(placemarkCollection);



			myPlacemark.events.add('dragend', function (e) {
				//var idDragendPl = e.get('target').properties.get('balloonContent');
				var newCoords = e.get('target').geometry.getCoordinates();
				tower.lat = newCoords[0];
				tower.lon = newCoords[1];
				//console.log(`Новые коорд: ${tower.lat} ${tower.lon}!`);
				polylineCollection.removeAll()
				var lines = getBrokenLines(towers);
				var anamalDist = check_distances(conns, towers);
				var redTowers = [];
				anamalDist.forEach(function(dist){
					if(!redTowers.includes(dist.to)){
						redTowers.push(dist.to);
					}
					if(!redTowers.includes(dist.from)){
						redTowers.push(dist.from);
					}
				});
				var colorTower = redTowers.includes(e.get('target').properties.get('iconContent')) ? 'islands#redCircleIcon' : 'islands#blueCircleIcon';
				 e.get('target').options.set({
					preset: colorTower,
					// iconContent: $('input[name="icon_text"]').val(),
					// hintContent: $('input[name="hint_text"]').val(),
					// balloonContent: $('input[name="balloon_text"]').val()
				});

				//var anamalDist = check_distances(conns, towers);
				//console.log({anamalDist});

				var lines = getBrokenLines(towers);
				outputDistance(conns, towers);
				var distanceLine = lines.reduce(function(distance, line) {
					return distance + addLines(line);
				}, 0);
				var distanceConn = build_conn(conns, towers);
				var totalDistance = distanceLine + distanceConn;
				var element = $('#total_dist');
				clearElement(element);
				generateLI(roundNumber(totalDistance, 1), element);

				element = $('#anamal-distance-between-towers');
				clearElement(element);
				//Вывод анамальных расстояний
				anamalDist.forEach(function(dist){
					var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
					generateLI(text, element);

				});

				element = $('#anamal-towers');
				clearElement(element);
				redTowers.forEach(function(tower){
					var element = $('#anamal-towers');
					var text = 'Опора ' + tower;
					generateLI(text, element);
				});
				element = $('#distance-between-towers');
				clearElement(element);
				var distance_betwen_towers = outputDistance(conns, towers);
				distance_betwen_towers.forEach(function(line){
					line.forEach(function(dist){	
						var element = $('#distance-between-towers');
						var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
						generateLI(text, element);
					});
				});
						// lines.forEach(addLines);
				var distanceLine = lines.reduce(function(distance, line) {
					return distance + addLines(line);
				}, 0);
				var distanceConn = build_conn(conns, towers);
				var totalDistance = distanceLine + distanceConn;
				outputDistance(conns, towers);

				var anamalDist = check_distances(conns, towers);
				console.log(anamalDist);

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

	$('.button_input-file').click(() => {
		$('#input-file').click();
	});

	function clearElement(element) {
		element.html('');
	}

	function generateLI(text, element) {
		var li = $('<li>').text(text);
		element.append(li);
	}

	function setNameVL(name) {
		$('#name-VL').text(name);
	}


	function roundNumber(number, n) {
		if(typeof number !== 'number') {
			return 0;
		}


		if(Number.isInteger(n)) {
			var m = 10 ** n;
			return Math.round(number*m)/m;
		}

		return Math.round(number);
	}

	
});
