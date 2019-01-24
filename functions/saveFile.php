<?php
	require_once 'Classes/PHPExcel.php';

	$fileName = $_POST['fileName'];
	$towers = $_POST['towers'];
	//$boot_path = $_SERVER['DOCUMENT_ROOT'] . '/download_files/'.$fileName;
	//print_r($towers);

	//$xlsFile = PHPExcel_IOFactory::createReader('Excel2007'); 
	//echo $boot_path;
	$xlsFile = PHPExcel_IOFactory::load($fileName); // Empty Sheet 

	$xlsFile->setActiveSheetIndex(0); 
	// $excel2->getActiveSheet()->setCellValue('C6', '4') 
	//     ->setCellValue('C7', '5') 
	//     ->setCellValue('C8', '6')  
	//     ->setCellValue('C9', '7'); 

	// $excel2->setActiveSheetIndex(1); 
	// $excel2->getActiveSheet()->setCellValue('A7', '4') 
	//     ->setCellValue('C7', '5'); 
	// $objWriter = PHPExcel_IOFactory::createWriter($excel2, 'Excel2007'); 
	// $objWriter->save('Nimit New.xlsx'); 


	//print_r($towers[0]);
	$Start = 8;
	//$Res = array();
	$xlsFile->setActiveSheetIndex(0);
	//print_r($towers);
	// asort($towers);
	// print_r($towers);
	$towersLen = count($towers);
	for ($i = 0; $i < $towersLen; $i++){
		if($xlsFile->getActiveSheet()->getCell('A'.$Start)->getValue() <> ''){

			//echo('из таблицы:' . $xlsFile->getActiveSheet()->getCell('A'.$Start)->getValue() . '\n');
			//print_r($towers[$i]['id']);
			$id = $xlsFile->getActiveSheet()->getCell('A'.$Start)->getValue();

			print_r($id . '==' . $towers[$i]['id']);
			//for ()
			if ($id == $towers[$i]['id']){
				$xlsFile->getActiveSheet()->setCellValue(('T'.$Start), $towers[$i]['lat']);
				$Start++;
				$xlsFile->getActiveSheet()->setCellValue(('T'.$Start), $towers[$i]['lon']);
				echo 'true';
				$Start++;

			} else {
				$Start++;
				$Start++;
				echo 'false';
			}

			print_r(' ');

			
			
		}
	}
	$objWriter = PHPExcel_IOFactory::createWriter($xlsFile, 'Excel5');
	$objWriter->save($fileName); 
	// for ($i= $Start; $i <= 1000; $i = $i+2) {
	// 	if($xlsFile->getActiveSheet()->getCell('A'.$i)->getValue() <> '') {
	// 		$xlsFile->getActiveSheet()->getCell('A'.$i )->getValue() == $towers[0][id]
	// 	}
	// //print_r(json_encode($Res);

	// }
	//print_r(json_encode($Res));

	//print_r($fileName);
	die();

?>
