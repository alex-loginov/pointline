<?php
	require_once 'Classes/PHPExcel.php';
	$phpExcel = new PHPExcel();

	$uploadfile = $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$file_type = substr($uploadfile, strrpos($uploadfile, '.')+1);
		if ($file_type === 'xls') {
			$xlsFile = PHPExcel_IOFactory::load($uploadfile);
			$Start = 8;
			$Res = array();
			$xlsFile->setActiveSheetIndex(0);
			for ($i= $Start; $i <= 1000; $i = $i+2) {
				if($xlsFile->getActiveSheet()->getCell('A'.$i)->getValue() <> '') {
					$nameSupport_vv = $xlsFile->getActiveSheet()->getCell('G'.$i )->getValue();
					$nameSupport_v = (int) (substr($nameSupport_vv, strrpos($nameSupport_vv, ' ')+1));
					$Row = array(
						'id' => $xlsFile->getActiveSheet()->getCell('A'.$i )->getValue(), //'это не нужный айдишник'sector
						'idVL' => $xlsFile->getActiveSheet()->getCell('B'.$i )->getValue(), //'это код ВЛ'
						'nameVL' => $xlsFile->getActiveSheet()->getCell('C'.$i )->getValue(), //''
						'idSector' => $xlsFile->getActiveSheet()->getCell('D'.$i )->getValue(), //'это код Участка ВЛ'
						'nameSector' => $xlsFile->getActiveSheet()->getCell('E'.$i )->getValue(), //''
						'idSupport' => $xlsFile->getActiveSheet()->getCell('F'.$i )->getValue(), //'это код Опоры Участка ВЛ'
						'nameSupport' => $nameSupport_v, //'номер опоры'
						'lat' => $xlsFile->getActiveSheet()->getCell('T'.$i )->getValue(), //'широта'
						'lon' => $xlsFile->getActiveSheet()->getCell('T'.($i+1) )->getValue(), //'долгота'
					);

					$Res[] = $Row;
					//print_r($Res);
				}
			//print_r(json_encode($Res);

			}
			print_r(json_encode($Res));

			
			die();

		}
		echo "Файл неверного фармата!";
	}

	echo "Файл неперемещен!";

?>
