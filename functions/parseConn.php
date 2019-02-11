<?php
	require_once 'Classes/PHPExcel.php';
	$phpExcel = new PHPExcel();
	$uploadfile = $_FILES['file']['name'];
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$file_type = substr($uploadfile, strrpos($uploadfile, '.')+1);
		if ($file_type === 'xls') {
			$xlsFile = PHPExcel_IOFactory::load($uploadfile);
			$Res1 = array();
			$xlsFile->setActiveSheetIndex(1);
			$Start = 2;
			for ($i= $Start; $i <= 10; $i++) {

				if($xlsFile->getActiveSheet()->getCell('A'.$i)->getValue() <> '') {
					$nameConn = $xlsFile->getActiveSheet()->getCell('B'.$i )->getValue() . ' ' . $xlsFile->getActiveSheet()->getCell('C'.$i )->getValue(); // имя соединения
					$tower1 = $xlsFile->getActiveSheet()->getCell('D'.$i )->getValue(); //'это код опоры1
					$tower2 = $xlsFile->getActiveSheet()->getCell('E'.$i )->getValue(); //'это код опоры2'
					$Row = array(
						$nameConn,
						$tower1,
						$tower2,
					);
					$Res1[] = $Row;
				}
			}
			print_r(json_encode($Res1));
			
			die();
		}
	}

?>
