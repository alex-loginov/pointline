<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<section class="section section_main-header"> 

	</section>

	<section class="section section_main-body"> 
		<div class="section__wrap">
			<form id="form-1" enctype="multipart/form-data" class="section-pick_up_file_for_conversion__form">
				<input type="hidden" name="MAX_FILE_SIZE" value="6000000" />
			    <p>
			   		<input type="file" name="userfile">
				   	<input type="submit" value="Обработать">
				</p>
		  	</form> 
		  	<form id="getCoords" enctype="multipart/form-data" class="section-pick_up_file_for_conversion__form">
			    <p>
				   	<input type="submit" id="" value="Узнать">
				</p>
		  	</form> 
		</div>
	</section>
	<!-- <div id="map" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"></div> -->

	<section class="section section_main-footer"></section>
	<div id="map"></div>
	<style>
        html, body, #map {
            width: 100%; height: 100%; padding: 0; margin: 0;
        }
    </style>
	<script src="functions/libs/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"></script>
	<script src="https://api-maps.yandex.ru/2.1/?apikey=233820d4-a6d2-43b2-9525-e332a89ea4b1&lang=ru_RU" type="text/javascript"></script>
	<script type="text/javascript" src="functions/index.js"></script>

</body>
</html>



