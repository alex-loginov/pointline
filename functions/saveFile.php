<?php
	require_once 'Classes/PHPExcel.php';

	$fileName = $_POST['fileName'];
	$towers = $_POST['towers'];
	$xlsFile = PHPExcel_IOFactory::load($fileName);
	$xlsFile->setActiveSheetIndex(0); 
	$Start = 8;
	$xlsFile->setActiveSheetIndex(0);
	$towersLen = count($towers);
	for ($i = 0; $i < $towersLen; $i++){
		if($xlsFile->getActiveSheet()->getCell('A'.$Start)->getValue() <> ''){
			$id = $xlsFile->getActiveSheet()->getCell('A'.$Start)->getValue();
			print_r($id . '==' . $towers[$i]['id']);
			//for ()
			if ($id == $towers[$i]['id']){
				$xlsFile->getActiveSheet()->setCellValue(('T'.$Start), $towers[$i]['lat']);
				$Start++;
				$xlsFile->getActiveSheet()->setCellValue(('T'.$Start), $towers[$i]['lon']);
				$Start++;
			} else {
				$Start+2;
				//$Start++;
			}
		}
	}
	$objWriter = PHPExcel_IOFactory::createWriter($xlsFile, 'Excel5');
	$objWriter->save($fileName); 
	die();

?>
