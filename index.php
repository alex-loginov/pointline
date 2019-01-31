<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="styles/style.css">
  </head>

  <body>
    <div class="page">

      <section class="section section_main-header">

        <form class ="section_main-body_form" id="form-1" enctype="multipart/form-data" class="section-pick_up_file_for_conversion__form">

          <button type="button" class="button button_action button_input-file">Выберите файл</button>
          <input type="file" name="userfile" class="input-file" id="input-file">
          

          <input class="button button_action" type="submit" value="Обработать">

        </form>
        <section class="section section_main-body batton_save_and_download">
          <input class="button button_action" type="button" id="saveRes" value="Сохранить">
          <input class="button button_action" type="button" id="download" value="Скачать">
        </section>
          
      </section>

      <section class="section section_main-body">
        <div id="map"></div>
      </section>

  </div>

    <script src="functions/libs/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"></script>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=233820d4-a6d2-43b2-9525-e332a89ea4b1&lang=ru_RU" type="text/javascript"></script>
    <script type="text/javascript" src="functions/index.js"></script>

  </body>
</html>



