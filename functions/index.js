$(document).ready(function() {
	var myMap;
	ymaps.ready(build_map);


	$('#form-1').submit(function(e) {
		e.preventDefault();
		var fd = new FormData;
		
		var fileInput = $(this).find('[name=userfile]').prop('files')[0];
		var fileInputName = fileInput.name;
		fd.append('file', fileInput);
		parseCoords(fileInputName);		
		function parseCoords(fileInputName){
			$.ajax({
				url: 'functions/parseCoords.php',
				type: 'POST',
				processData: false,
				contentType: false,
				data: fd,
				async: true,
				success: function(data) {
					var towers = JSON.parse(data);
					parseConn(towers, fileInputName);
					console.log({towers});
				},
				error: function(error) {
					console.log('error', error);
				},	
			});
		}
		
		function parseConn(towers, fileInputName) {
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

 	function getAllDist(conns, towers){
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
		var coordTower1 = [];
		var coordTower2 = [];
		var nameTower1 = [];
		var nameTower2 = [];
		lines = lines.concat([conns.map(function(conn){
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
			return {
				from: nameTower1,
				to: nameTower2,
				distance: getDistanceBetweenTwoTowers(coordTower1, coordTower2),
			};
		})]);
		return lines;
 	}

	function getDistanceBetweenTwoTowers(tower1, tower2){
		return ymaps.coordSystem.geo.getDistance(tower1, tower2);
	}

	function build_conn(conns, towers){
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
		var distanceMass = getAllDist(conns, towers);
		var allDist = distanceMass.reduce(function(result, line) {
			return result.concat(line);
		}, []);
		allDist.sort(function(a, b){
			return a.distance - b.distance;
		});
 		var srZ = 0;
		var lenAllDist = allDist.length;
		if(lenAllDist % 2 == 0) {
			srZ = (allDist[lenAllDist/2].distance + allDist[(lenAllDist/2)+1].distance)/2;
		}else {
			srZ = allDist[Math.ceil(lenAllDist/2)].distance;
		}
		anomalDist = [];
		allDist.forEach(function(dist){
			if(dist.distance < (srZ+15) && dist.distance > (srZ-15)){
			}else{
				anomalDist.push(dist);
			}
		});		
		var srDis = 0;
		allDist.forEach(function(disdt){
			srDis +=disdt.distance;
		});
		return anomalDist;
	}

	function init(conns, towers, fileInputName) {  
		polylineCollection = new ymaps.GeoObjectCollection();
		placemarkCollection = new ymaps.GeoObjectCollection();
		var lines = getBrokenLines(towers);
		var distanceLine = lines.reduce(function(distance, line) {
			return distance + addLines(line);
		}, 0);
		var distanceConn = build_conn(conns, towers);
		var totalDistance = distanceLine + distanceConn;
		var element = $('#total_dist');
		generateLI(roundNumber(totalDistance, 1), element);
		var anomalDist = check_distances(conns, towers);
		//Вывод анамальных расстояний
		var distance_betwen_towers = getAllDist(conns, towers);
		distance_betwen_towers.forEach(function(line){
			line.forEach(function(dist){	
				var element = $('#distance-between-towers');
				var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
				generateLI(text, element);
			});
		});
		anomalDist.forEach(function(dist){
			var element = $('#anamal-distance-between-towers');
			var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
			generateLI(text, element);
		});
		var anomalTowers = [];
		anomalDist.forEach(function(dist){
			if(!anomalTowers.includes(dist.to)){
				anomalTowers.push(dist.to);
			}
			if(!anomalTowers.includes(dist.from)){
				anomalTowers.push(dist.from);
			}
		});
		//Вывод плохих опор
		anomalTowers.forEach(function(tower){
			var element = $('#anamal-towers');
			var text = 'Опора ' + tower;
			generateLI(text, element);
		});
		console.log(anomalTowers);
		console.log(anomalDist);

		towers.forEach(function(tower) {
			var myPlacemark;
			
			var colorTower = anomalTowers.includes(tower.nameSupport)
			? 'islands#redCircleIcon' : 'islands#blueCircleIcon';

				myPlacemark = new ymaps.Placemark([tower.lat, tower.lon], {

					iconContent: tower.nameSupport,
				}, {
					preset: colorTower,
					draggable: true
				})
				placemarkCollection.add(myPlacemark);
				myMap.geoObjects.add(placemarkCollection);

				myPlacemark.events.add('dragend', function (e) {
					var newCoords = e.get('target').geometry.getCoordinates();
					tower.lat = newCoords[0];
					tower.lon = newCoords[1];
					polylineCollection.removeAll()
					var anomalDist = check_distances(conns, towers);
					var anomalTowers = [];
					anomalDist.forEach(function(dist){
						if(!anomalTowers.includes(dist.to)){
							anomalTowers.push(dist.to);
						}
						if(!anomalTowers.includes(dist.from)){
							anomalTowers.push(dist.from);
						}
				});
				var colorTower = anomalTowers.includes(e.get('target').properties.get('iconContent'))
				?'islands#redCircleIcon' : 'islands#blueCircleIcon';
				 e.get('target').options.set({
					preset: colorTower,
				});
				var lines = getBrokenLines(towers);
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
				anomalDist.forEach(function(dist){
					var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
					generateLI(text, element);

				});

				element = $('#anamal-towers');
				clearElement(element);
				anomalTowers.forEach(function(tower){
					var element = $('#anamal-towers');
					var text = 'Опора ' + tower;
					generateLI(text, element);
				});
				element = $('#distance-between-towers');
				clearElement(element);
				var distance_betwen_towers = getAllDist(conns, towers);
				distance_betwen_towers.forEach(function(line){
					line.forEach(function(dist){	
						var element = $('#distance-between-towers');
						var text = 'Пролет ' + dist.from + ' - ' + dist.to + ':  ' + roundNumber(dist.distance, 1) + ' м';
						generateLI(text, element);
					});
				});
				var distanceLine = lines.reduce(function(distance, line) {
					return distance + addLines(line);
				}, 0);
				var distanceConn = build_conn(conns, towers);
				var totalDistance = distanceLine + distanceConn;

				var anomalDist = check_distances(conns, towers);
				console.log(anomalDist);

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
					alert( "Изменения сохранены" );
				}).fail((error) => {

					console.log('error', { error });
				});
		});

		$('#download').click(function() {
			window.location = 'functions/' + fileInputName;
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
		return lines;

	}

	function addLines(line) {
		var distPolyline = 0;
		var lineString = new ymaps.geometry.LineString(line);
		var geoObject = new ymaps.GeoObject({ geometry: lineString });
		polylineCollection.add(geoObject);
		myMap.geoObjects.add(polylineCollection);
		var a = polylineCollection.toArray();
		var distance = geoObject.geometry.getDistance();
		return distance;
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
