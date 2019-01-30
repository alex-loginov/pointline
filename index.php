<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>


	<body>
		<section class="section section_main-header"> 

		</section>

		<section class="section section_main-body"> 
			<div class="section__wrap">

				<form class ="section_main-body_form" id="form-1" enctype="multipart/form-data" class="section-pick_up_file_for_conversion__form">
					<input class="section_main-body_form-button" type="hidden" name="MAX_FILE_SIZE" value="6000000" />
				    <p>
				   		<input type="file" name="userfile">
					   	<input  class="section_main-body_form-button" type="submit" value="Обработать">
					</p>
			  	</form>
			  	<section class="section section_main-body batton_save_and_download">
			  		<input  class="section_main-body_form-button" type="submit" id="saveRes" value="Сохранить">
			  		<input  class="section_main-body_form-button" type="submit" id="download" value="Скачать">
			  	</section> 			  	
			  	
			</div>
		</section>
		<div id="map"></div>
		<div class="section section_main">
			<section class="section section_block-infarmation">
				<div class=""></div>
			</section>
		</div>

		<!-- <style>
	        html, body, #map {
	            width: 700px; height: 700px; padding: 0; margin: 0;
	        }
	    </style> -->
		<section class="section section_main-footer"></section>

		<script src="functions/libs/jquery-3.3.1.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"></script>
		<script src="https://api-maps.yandex.ru/2.1/?apikey=233820d4-a6d2-43b2-9525-e332a89ea4b1&lang=ru_RU" type="text/javascript"></script>
		<script type="text/javascript" src="functions/index.js"></script>

	</body>
</html>



