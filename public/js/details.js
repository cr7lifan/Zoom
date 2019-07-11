$(function(){
  // 获取地址栏中的lid
  var lid=location.search.split("=")[1];
  console.log(lid);
  $.ajax({
    url:'http://localhost:3000/details',
    type:'get',
    data:{lid},
    dataType:'json',
    success:function(result){
      console.log(result);
      var {product, specs, pics}=result;
      console.log(pics);
      //1. 填充右上角基本信息
      var {title,subtitle,price,promise}=product;
      $("#title").html(title);
      $("#subtitle").html(subtitle);
      $("#price").html(`¥${price.toFixed(2)}`);
      $("#promise").html(promise);
        //填充图片
          //填充小图片列表
          var html="";
          for(var i of pics){
            html+=`<li class="float-left p-1">
               <img src="${i.sm}" data-md="${i.md}" data-lg="${i.lg}">
          </li>`
          }
          var $ulImgs=$("#ul-imgs");
          $ulImgs.html(html);
          var liWidth=62;
          $width=liWidth*pics.length;
          $ulImgs.css("width",$width+'px');
      // 设置中图片ming的src为pics中的第一张中图片
          var $mimg=$("#mimg");
          console.log($mimg);
          $mimg.attr("src",pics[0].md);
     //点击箭头，移动小图片
          // 点击的次数
          var times=0;
          $("#btn-left").click(function(){
            $("#btn-right").removeClass("disabled");
            if(pics.length-times<5){
              $(this).addClass("disabled");
            }
            if(!$(this).is(".disabled")){
              times++;
              var left=parseInt($ulImgs.css("margin-left"));
              // console.log(left);
              $ulImgs.css("margin-left",left-liWidth+"px");
            }
          })
          $("#btn-right").click(function(){
            $("#btn-left").removeClass("disabled");
            if(!$(this).is(".disabled")){
              times--;
              // console.log(times);
              if(times==0){
                ($(this).addClass("disabled"));
              }
              var left=parseInt($ulImgs.css("margin-left"));
              // console.log(left);
              $ulImgs.css("margin-left",left+liWidth+"px");
            }
          })
      // 鼠标移动小图片切换中图片
      var $mImg=$("#mimg");
      var $divLg=$("#div-lg");
      $divLg.css("background-image",`url(${pics[0].lg})`);
      $ulImgs.on("mouseenter","li>img",function(){
          $mImg.attr("src",$(this).attr("data-md"));
          var limg=$(this).attr("data-lg");
          $divLg.css("background-image",`url(${limg})`);
      })
      // 放大镜效果
      var $mask=$("#mask");
      // $("#super-mask").mouseover(function(){
      //   $mask.removeClass("d-none");
      // })
      // $("#super-mask").mouseleave(function(){
      //   $mask.addClass("d-none");
      // })
     
      $("#super-mask").hover(function(){
          $mask.toggleClass("d-none");
          $divLg.toggleClass("d-none");
        }
      )
      $("#super-mask").mousemove(function(e){
        var w=parseInt($("#super-mask").css("width"));
        var h=parseInt($("#super-mask").css("height"));
        // console.log(w,h);
        var maskW=parseInt($mask.css("width"));
        var maskH=parseInt($mask.css("height"));
        var top=e.offsetY-maskH/2;
        var left=e.offsetX-maskW/2;
        if(top<=0){
          top=0;
        }
        if(top>=h-maskH){
          top=h-maskH;
        }
        if(left<=0){
          left=0;
        }
        if(left>=w-maskW){
          left=w-maskW;
        }
        $mask.css({"left":left+"px","top":top+"px"});
        var stop=top*(800/h);
        // console.log(sH,h);
        var sleft=left*(800/w);
        $divLg.css("background-position",`-${sleft}px -${stop}px `)
      })
    }
  })
})