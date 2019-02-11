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

        <form id="form-1" enctype="multipart/form-data" class="form-start">

          <button type="button" class="button button_action button_input-file">Выберите файл</button>
          <input type="file" name="userfile" class="input-file" id="input-file">
          <input class="button button_action" type="submit" value="Обработать">

        </form>

        <section class="section section_main-body">
          <input class="button button_action" type="button" id="saveRes" value="Сохранить">
          <input class="button button_action" type="button" id="download" value="Скачать">
        </section>

      </section>

      <section class="section section_main-body">
        <div class="section-map">
          <div id="map"></div>
        </div>
        <div class="section-information">
          <div class="basic_inf">
            <div class="label label-basic_inf">
              <h3>Общая протяженность: </h3>
              <p id="total_dist"></p>
            </div>
            <div class="label label-basic_inf">
              <h3>Расстояния между опорами:</h3>
              <ul id="distance-between-towers"  class="common-list"></ul>
            </div>
          </div>
          <div class="verification_inf">
            <div class="label label-verification_inf">
              <h3>Аномальные расстояния между опорами:</h3>
              <ul id="anamal-distance-between-towers" class="common-list"></ul>
            </div>
            <div class="label 1verification_inf">
              <h3>Опоры на которые стоит обратить внимание:</h3>
                <ul id="anamal-towers" class="common-list"></ul>
               

            </div>
          </div>
          
        </div>
      </section>

  </div>

    <script src="functions/libs/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"></script>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=233820d4-a6d2-43b2-9525-e332a89ea4b1&lang=ru_RU" type="text/javascript"></script>
    <script type="text/javascript" src="functions/index.js"></script>

  </body>
</html>



