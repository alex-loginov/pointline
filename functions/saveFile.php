<?php
	require_once 'Classes/PHPExcel.php';

	// $phpExcel = new PHPExcel();
	// $json = file_get_contents('php://input');
	// $obj = json_decode($json);
	// $fileInputName = filter_input(INPUT_POST, 'fileName');
	// $towers = filter_input(INPUT_POST, 'towers');
	$fileName = $_POST['fileName'];
	$towers = $_POST['towers'];
	
	print_r($fileName . '\n' . $towers);

	// $excel2 = PHPExcel_IOFactory::createReader('Excel2007'); 
	// $excel2 = $excel2->load('nTest.xlsx'); // Empty Sheet 
	// $excel2->setActiveSheetIndex(0); 
	// $excel2->getActiveSheet()->setCellValue('C6', '4') 
	//     ->setCellValue('C7', '5') 
	//     ->setCellValue('C8', '6')  
	//     ->setCellValue('C9', '7'); 

	// $excel2->setActiveSheetIndex(1); 
	// $excel2->getActiveSheet()->setCellValue('A7', '4') 
	//     ->setCellValue('C7', '5'); 
	// $objWriter = PHPExcel_IOFactory::createWriter($excel2, 'Excel2007'); 
	// $objWriter->save('Nimit New.xlsx'); 



	// $Start = 8;
	// $Res = array();
	// $xlsFile->setActiveSheetIndex(0);
	// for ($i= $Start; $i <= 1000; $i = $i+2) {
	// 	if($xlsFile->getActiveSheet()->getCell('A'.$i)->getValue() <> '') {
	// 		$nameSupport_vv = $xlsFile->getActiveSheet()->getCell('G'.$i )->getValue();
	// 		$nameSupport_v = (int) (substr($nameSupport_vv, strrpos($nameSupport_vv, ' ')+1));
	// 		$Row = array(
	// 			'id' => $xlsFile->getActiveSheet()->getCell('A'.$i )->getValue(), //'это не нужный айдишник'sector
	// 			'idVL' => $xlsFile->getActiveSheet()->getCell('B'.$i )->getValue(), //'это код ВЛ'
	// 			'nameVL' => $xlsFile->getActiveSheet()->getCell('C'.$i )->getValue(), //''
	// 			'idSector' => $xlsFile->getActiveSheet()->getCell('D'.$i )->getValue(), //'это код Участка ВЛ'
	// 			'nameSector' => $xlsFile->getActiveSheet()->getCell('E'.$i )->getValue(), //''
	// 			'idSupport' => $xlsFile->getActiveSheet()->getCell('F'.$i )->getValue(), //'это код Опоры Участка ВЛ'
	// 			'nameSupport' => $nameSupport_v, //'номер опоры'
	// 			'lat' => $xlsFile->getActiveSheet()->getCell('T'.$i )->getValue(), //'широта'
	// 			'lon' => $xlsFile->getActiveSheet()->getCell('T'.($i+1) )->getValue(), //'долгота'
	// 		);

	// 		$Res[] = $Row;
	// 		//print_r($Res);
	// 	}
	// //print_r(json_encode($Res);

	// }
	// print_r(json_encode($Res));

	
	die();

?>
