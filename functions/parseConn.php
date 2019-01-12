<?php
	require_once 'Classes/PHPExcel.php';
	$phpExcel = new PHPExcel();

	$uploadfile = $_FILES['file']['name'];
	// echo $uploadfile;

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {

		$file_type = substr($uploadfile, strrpos($uploadfile, '.')+1);
		if ($file_type === 'xls') {
			$xlsFile = PHPExcel_IOFactory::load($uploadfile);
			$Res1 = array();
			$xlsFile->setActiveSheetIndex(1);
			$Start = 3;

			for ($i= $Start; $i <= 10; $i++) {

				if($xlsFile->getActiveSheet()->getCell('A'.$i)->getValue() <> '') {
					$nameConn = $xlsFile->getActiveSheet()->getCell('A'.$i )->getValue() . ' ' . $xlsFile->getActiveSheet()->getCell('B'.$i )->getValue();
					$lat1 = $xlsFile->getActiveSheet()->getCell('C'.$i )->getValue(); //'это не нужный айдишник'sector
					$lon1 = $xlsFile->getActiveSheet()->getCell('D'.$i )->getValue(); //'это код ВЛ'
					$lat2 = $xlsFile->getActiveSheet()->getCell('E'.$i )->getValue();
					$lon2 = $xlsFile->getActiveSheet()->getCell('F'.$i )->getValue();

					$tower1 = array($lat1,$lon1);
					$tower2 = array($lat2,$lon2);
					
					$Row = array(
						$tower1,
						$tower2,
					);

					$Res1[] = $Row;
					// print_r(json_encode($Row));
				}
			

			}
			print_r(json_encode($Res1));
			
			die();
		}
		echo "Файл неверного фармата!";
	}

	echo "Файл неперемещен!";

?>
