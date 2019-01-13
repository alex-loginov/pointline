$(document).ready(function() {
	var myMap;

	$('#form-1').submit(function(e) {
		e.preventDefault();

		var fd = new FormData;
		
		var fileInput = $(this).find('[name=userfile]').prop('files')[0];
		fd.append('file', fileInput);
		plotting();
		
		function plotting(){

			$.ajax({
				url: 'functions/parseCoords.php',
				type: 'POST',
				processData: false,
				contentType: false,
				data: fd,
				async: true,
				success: function(data) {
					//console.log({ data });
					//return;
					var towers = JSON.parse(data);
					console.log({ towers });


					init(towers);
					var lines = getBrokenLines(towers);
					lines.forEach(addLines);
					console.log('lines', lines);
					building_connections();

				},
				error: function(error) {
					console.log('error', error);
				},	
			});
		}
		

		function building_connections() {


			$.ajax({
				url: 'functions/parseConn.php',
				type: 'POST',
				processData: false,
				contentType: false,
				data: fd,
				async: true,
				success: function(data) {
					//console.log({ data });
					//return;

					var conns = JSON.parse(data);
					console.log({ conns });
					//console.log({ conns });
					//addLines(conns);
					//init();
					//var lines = getBrokenLines(towers);
					conns.forEach(addLines);

					// console.log('lines', lines);
					// renderCoords(coords);

				},
				error: function(error) {
					console.log('error', error);
				},	
			});
		}



	});

	// ymaps.ready(init);
 
	$('#getCoords').submit(function(e) {
		e.preventDefault();
		console.log('заходит?');

	});



	function init(coords) {  
		// console.log('init', coords);
		myMap = new ymaps.Map("map", {
			center: [56.309319, 43.962170],
			zoom: 10
		}),

		myGeoObject = new ymaps.GeoObject();
		coords.forEach(function(coord) {
			var colors = {
				'VS006-1800128-001': '#a00',
				'VS006-1800128-002': '#a80',
				'VS006-1800128-003': '#0a0',
			};

			myMap.geoObjects.add(myPlacemark = new ymaps.Placemark([coord.lat, coord.lon], {

				//balloonContent: coord.nameSupport,
				//iconCaption: coord.nameSupport,
				iconContent: coord.nameSupport,

			}, {
				preset: 'islands#blueCircleIcon',
				iconColor: colors[coord.idSector],
				draggable: true

			}));
			myPlacemark.events.add('dragend', function (e) {
               var coords = e.get('target').geometry.getCoordinates();
               console.log( coords[1].toPrecision(6));
                console.log( coords[0].toPrecision(6));
                 //   document.getElementById('geox').value = coords[1].toPrecision(6);
                	// document.getElementById('geoy').value = coords[0].toPrecision(6);
            });

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

	function addLines(lines) {

		var myPolyline = new ymaps.Polyline(lines, {

		}, {
	        // Задаем опции геообъекта.
	        // Цвет с прозрачностью.
	        strokeColor: "#00000088",
	        preset: 'islands#blueCircleIcon',
	        // Ширину линии.
	        strokeWidth: 4,

	        // Максимально допустимое количество вершин в ломаной.
	        editorMaxPoints: 0,
	        // Добавляем в контекстное меню новый пункт, позволяющий удалить ломаную.
	        editorMenuManager: function (items) {
	            items.push({
	                title: "Удалить линию",
	                onClick: function () {
	                    myMap.geoObjects.remove(myPolyline);
	                }
	            });
	            return items;
	        }
	    });

	    //console.log({ myMap });

	    // Добавляем линию на карту.
	    myMap.geoObjects.add(myPolyline);
	    myPolyline.editor.startEditing();

	}

	function build_conn(){

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
		