<?php
header ("Content-Type: text/html; charset=utf-8");
?>
<section class="section section_main-header"> 

</section>

<section class="section section_main-body"> 
	<div class="section__wrap">
		<form enctype="multipart/form-data" action="functions/converter.php" class="section-pick_up_file_for_conversion__form" method="POST">
			<input type="hidden" name="MAX_FILE_SIZE" value="6000000" />
		   <p><input type="file" name="userfile">
		   <input type="submit" value="Обработать"></p>
	  	</form> 
	</div>
</section>

<section class="section section_main-footer"> 

</section>


