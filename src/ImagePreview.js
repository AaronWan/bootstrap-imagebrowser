/**
 * Created by lenovo on 2014/12/10.
 */
(function($) {
    'use strict';
    /**
     * @param element
     * @param options
     * @constructor
     */
    var ImagePreview = function (element,options){
        this.$element=element;
        this.width=options.width || 200;
        this.height=options.height || 200;
    }
    ImagePreview.DEFAULTS = {
        max_size:1.5
    }
    /**
     *
     * @param element
     * @param callback
     */
    ImagePreview.prototype.preview=function(callback){
        if (document.body.filters) {
            this.iePreview(callback);
        }
        else if (window.HTMLCanvasElement) {
            this.canvasPreview(callback);
        }
    }
    /**
     * @param callback
     */
    ImagePreview.prototype.iePreview=function(callback){
        var self=this;
        this.$element.select();
        this.$element.blur();
        var src = this.$element.value;
        var imgitem = $('<div style="margin-bottom: 5px;"></div>').appendTo('body');
        var f = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "' , sizingMethod= 'image' )";
        imgitem.css({
            filter: f,
            display: 'none',
            width: '1px',
            height: '1px'
        });
        var itval = setInterval(function () {
            var w = imgitem.width();
            if (w !== 1) {
                window.clearInterval(itval);
                var boxWidth = self.width;
                var boxHeight = self.height;

                var zoom = self.calcZoom({
                    boxWidth: boxWidth,
                    boxHeight: boxHeight,
                    imgWidth: imgitem.width(),
                    imgHeight: imgitem.height()
                });
                var fn = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "' , sizingMethod= 'scale' )";
                var out = $('<div></div>').css(zoom).css({
                    'filter': fn,
                    display: 'block'
                });

                out.addClass("img-thumbnail");
                callback(out);
                imgitem.remove();
            }
        }, 16);
    }
    /**
     * @param callback
     */
    ImagePreview.prototype.canvasPreview=function(callback){
        var self=this;
        var files = this.$element.files;
        $.each(files, function (index, val) {
            var img = new Image();
            img.src = window.URL.createObjectURL(val);
            img.onload = function (e) {
                window.URL.revokeObjectURL(img.src);
                var boxWidth = self.width;
                var boxHeight = self.height;
                var zoom = self.calcZoom({
                    boxWidth: boxWidth,
                    boxHeight: boxHeight,
                    imgWidth: img.naturalWidth,
                    imgHeight: img.naturalHeight
                });
                var out = $(img).css(zoom);
                out.addClass("img-thumbnail");
                callback(out);
            };
        });
    }
    /**
     *
     * @param params
     */
    ImagePreview.prototype.calcZoom = function(param){
        var boxw = param.boxWidth;
        var boxh = param.boxHeight;
        var imgw = param.imgWidth;
        var imgh = param.imgHeight;
        var out = {
            width: '0px',
            height: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            marginBottom: '0px'
        };

        if (boxw / boxh > imgw / imgh) {
            out.height = boxh;
            out.width = imgw / imgh * boxh;
            out.marginLeft = (boxw - out.width) / 2;
            out.marginRight = boxw - out.marginLeft - out.width;
        } else {
            out.width = boxw;
            out.height = imgh / imgw * boxw;
            out.marginTop = (boxh - out.height) / 2;
            out.marginBottom = boxh - out.marginTop - out.height;
        }
        return out;
    }

    /**
     * 当选反了文件后触发的事件
     * @param e
     */
    ImagePreview.prototype.selected = function(e){
        var fileinput = this.$element;
        var self=this;
        if (fileinput&&(!fileinput.files || fileinput.files.length == 1)) {
            this.$imgcollection.hide();
            var size = !fileinput.files?1:fileinput.files[0].size / (1024.0 * 1024);
            if(self.validate(size)){
                this.$error.hide();
                this.preview( function ($obj) {
                    self.$imgcollection.html("");
                    self.$imgcollection.append($obj);
                });
                this.$imgcollection.show();
           }
        }
    }
    /**
     * 验证图片的大小
     */
    ImagePreview.prototype.validate = function (size) {
        if (size >ImagePreview.DEFAULTS.max_size) {
            var temp = $('<input name="cover" type="file" data-ride="filebrowser" accept="image/gif, image/jpeg,image/png">');
            $(this.$element).before(temp);
            this.$element.remove();
            this.$imgcollection.remove();
            this.$error.remove();
            $.fn.imagepreview.call(temp, temp.data());
            var data=temp.data("bs.preview");
            data.$error.html(size.toFixed(2) + ">" + ImagePreview.DEFAULTS.max_size + "M,请选择小于"+ImagePreview.DEFAULTS.max_size+"M的图片");
            data.$error.show();
            return false;
        }else{
            this.$error.hide();
            return true;
        }
    }

    /**
     * JQuery plugin定义
     */
    var old = $.fn.imagepreview;
    $.fn.imagepreview = function(option,_relatedTarget){
        return this.each(function(){
            var $this=$(this);
            var data=$this.data("bs.preview");
            var options = $.extend({},$this.data(),typeof option == 'object'&&option);
            if(!data) $this.data('bs.preview',(data = new ImagePreview(this,options)));
            if(typeof option =='string') data[option](_relatedTarget);
            //添加提示信息
            data.$imgcollection=$("<div></div>");
            $this.before(data.$imgcollection);
            data.$error=$("<code style='display:none;'></code>");
            $this.before(data.$error);
            $(document).on("change", function(e){
                data.selected(e);
            } );
        });
    }
    $.fn.imagepreview.Constructor=ImagePreview;
    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.imagepreview.noConflict = function () {
        $.fn.imagepreview = old
        return this
    }

    $(window).on('load', function () {
        $('[data-ride="imagebrowser"]').each(function () {
            //需要优化  目前只针对一个
            var $fileinput = $(this);
            $.fn.imagepreview.call($fileinput, $fileinput.data());
        })
    })
})(jQuery);
