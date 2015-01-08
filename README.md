bootstrap-imagebrowser
======================

###bootstrap插件  用来在一个input type=file上展示当前选择的图片

###引入：
```html
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>

<!--[if lt IE 9]>
  <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->

<!--引入图片浏览插件-->
<script type="application/javascript" src="../dist/ImagePreview.js"></script>
```


###使用方法：
```html
<input  type="file" data-ride="imagebrowser" data-maxsize="1.5" accept="image/gif, image/jpeg">
```
