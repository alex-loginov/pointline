<?php
	require_once 'Classes/PHPExcel.php';
	$phpExcel = new PHPExcel();
	//$uploaddir = '/var/www/uploads/';
	//$xls = new PHPExcel();
//				$xls->setActiveSheetIndex(0);	
	$uploadfile = $_FILES['userfile']['name'];
	if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
		$file_type = substr($uploadfile, strrpos($uploadfile, '.')+1);
		if ($file_type == 'xls')
		{
			echo "Файл корректен и был успешно загружен: " ;
			echo $uploadfile;
			$xlsFile = PHPExcel_IOFactory::load($uploadfile);
			$Start = 8;
			$Res = array();
			for ($i= $Start; $i <= 100; $i++)
			{
				if($xlsFile->getActiveSheet()->getCell('A'.$i )->getValue() <> ''){

				    $Row = new stdClass();
				    $Row->id = $i;
				    $phpExcel->setActiveSheetIndex(0);
				    $Row->id = $xlsFile->getActiveSheet()->getCell('A'.$i )->getValue(); //'это не нужный айдишник'sector
				    $Row->idVL = $xlsFile->getActiveSheet()->getCell('B'.$i )->getValue(); //'это код ВЛ'
				    $Row->nameVL = $xlsFile->getActiveSheet()->getCell('C'.$i )->getValue(); //''
				    $Row->idSector = $xlsFile->getActiveSheet()->getCell('D'.$i )->getValue(); //'это код Участка ВЛ'
				    $Row->nameSector = $xlsFile->getActiveSheet()->getCell('E'.$i )->getValue(); //''
				    $Row->idSupport = $xlsFile->getActiveSheet()->getCell('F'.$i )->getValue(); //'это код Опоры Участка ВЛ'
				    $Row->nameSupport = $xlsFile->getActiveSheet()->getCell('G'.$i )->getValue(); //''
				    $Row->lat = $xlsFile->getActiveSheet()->getCell('T'.$i )->getValue(); //'широта'
				    $Row->lon = $xlsFile->getActiveSheet()->getCell('T'.$i++ )->getValue(); //'долгота'

					$Res[] = $Row;
				}

			}
			echo "<pre>";
			print_r($Res);
			echo "</pre>";


			
		}
		else {
	    	echo "Файл неверного фармата!\n";
	    	die();
		}
	    
	} else {
	    echo "Идите нахуй с новым годом\n";
	    die();
	}

	

	$json = ($xlsFile);
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="openlayers-v3.13.0/ol.css" type="text/css" />
	<title></title>
</head>
<body>

	<section class="section section_main-header"> </section>

	<section class="section section_main-body"> 
		<div class="section__wrap">
			<div id="map" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"></div>		
		</div>
	</section>

	<section class="section section_main-footer"> </section>

	<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<script src="openlayers-v3.13.0/ol.js"></script>
	
	<script type="text/javascript" src = "index.js"></script>
</body>
</html>