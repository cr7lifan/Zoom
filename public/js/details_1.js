
//在js文件夹下新建details.js
//在details.html中<body>内的底部
//添加<script src="js/header.js"
//  和<script src="js/details.js"

$(function(){
if(location.search!==""){
  //获得地址栏中的?lid=2中的2
  var lid=
    location.search.split("=")[1]
  console.log(lid);
  //用lid作为参数向服务端发送请求
  $.ajax({
    url:"http://localhost:3000/details",
    type:"get",
    data:{lid},
     // 自动↓翻译
     // ---------
     // ↓       ↓
     //参数名  变量名
       //{lid:lid},
       //自动翻译↓
       //"lid="+lid,
       //"lid=5"
  //实际发送的url是: url+?+data
//http://localhost:3000/details?lid=5
    dataType:"json",//JSON.parse()
    success:function(result){
      console.log(result);
      //先将三大块数据解构出来
      var {product, specs, pics}=result;
      //1. 填充右上角基本信息
      var {title,subtitle,price,promise}=product;
      $("#title").html(title);
      $("#subtitle").html(subtitle);
      $("#price").html(`¥${price.toFixed(2)}`);
      $("#promise").html(promise);
      //2. 填充右侧规格列表
      //先定义空html，等着接a的模板
      var html="";
      //遍历specs数组中每个规格对象
      for(var sp of specs){
        //每遍历一个规格对象，就多拼接一段a模板
        html+=`<a class="btn btn-sm btn-outline-secondary ${product.lid==sp.lid?'active':''}" href="product_details.html?lid=${sp.lid}">${sp.spec}</a>`
      }
      //将html整体填充回页面div中
      $("#specs").html(html);
      //3. 放大镜效果: 
      //3.1 填充图片
      //3.1.1 填充小图片列表
      //先定义空的html，准备接多个模板片段
      var html="";
      //遍历pics数组中每张图片对象
      for(var p of pics){
        //就向html中追加一段li片段
        html+=`<li class="float-left p-1">
        <img src="${p.sm}" data-md="${p.md}" data-lg="${p.lg}">
      </li>`
      }
      //将整段html片段填充到ul-imgs中
      var $ulImgs=$("#ul-imgs");
      //定义变量保存每个li的宽度，反复使用
      var LIWIDTH=62;
      $ulImgs.html(html)      
      //临时根据图片张数计算ul的宽:张数*图片宽
        .css("width",pics.length*LIWIDTH);
      //3.1.2 填充1张中图片
      //设置mimg的src为pics中第一张图片的中图片版本
      var $mImg=$("#mimg");
      var $lgDiv=$("#div-lg");
      $mImg.attr("src",pics[0].md)
      //同时为lgDIv设置背景图片为第一张图片的lg版本
      $lgDiv.css(
        "background-image",
        `url(${pics[0].lg})`
      )
      //3.2 点击箭头，移动小图片
      var $btnLeft=$("#btn-left");
      var $btnRight=$("#btn-right");
      //如果pics的图片数量<=4张,则一开始就禁用右边按钮
      if(pics.length<=4){
        $btnRight.addClass("disabled")
      }
      var times=0;//记录单击按钮的次数
      //每单击一次右边按钮，times+1，重新计算$ulImgs的marginLeft
      $btnRight.click(function(){
        //如果按钮上不是disabled，才能点
        if(!$btnRight.is(".disabled")){
          times++;
          $ulImgs.css(
            "margin-left",-times*LIWIDTH)
          //只要右边按钮点过一下，左边按钮一定启用
          $btnLeft.removeClass("disabled")
          //如果times==pics中图片张数-4
          if(times==pics.length-4){
            //说明多余图片都移动完了，就禁用右边按钮
            $btnRight.addClass("disabled")
          }
        }
      })
      //每单击一次左边按钮，times-1，重新计算$ulImgs的marginLeft
      $btnLeft.click(function(){
        if(!$btnLeft.is(".disabled")){
          times--;
          $ulImgs.css(
            "margin-left",-times*LIWIDTH)
          //只要左边按钮点过一下，则右边按钮一定启用
          $btnRight.removeClass("disabled");
          //如果times为0，则左边按钮禁用
          if(times==0){
            $btnLeft.addClass("disabled")
          }
        }
      })
      //3.3 鼠标进入小图片，切换中图片
      //事件委托，为父元素绑定鼠标进入事件，但是只有进入img时，才触发
      $ulImgs
      .on("mouseenter","li>img",function(){
        //获得当前图片
        //获得当前图片的data-md属性
        //将data-md属性赋值给$mImg的src
        $mImg.attr(
          "src",$(this).attr("data-md")
        );
        //同时获得当前小图片的data-lg属性，给$lgDiv做背景图片
        $lgDiv.css(
          "background-image",
          `url(${$(this).attr("data-lg")})`
        )
      })
      //3.4 当鼠标进出上层透明div时，切换小遮罩层mask的显示和隐藏
      var $mask=$("#mask");
      var $smask=$("#super-mask");
      var MSIZE=176;//记录小mask的大小
      var SMSIZE=352;//记录super-mask的大小
      $smask.hover(
        function(){
          $mask.toggleClass("d-none");
          //同时显示大div
          $lgDiv.toggleClass("d-none");
        }
      )
      //让遮罩层跟随鼠标移动
      .mousemove(function(e){
        //红=绿-蓝
        var top=e.offsetY-MSIZE/2;
        var left=e.offsetX-MSIZE/2;
        //如果top<0,就拉回0, 如果top>SMSIZE-MSIZE，就拉回SMSIZE-MSIZE
        if(top<0){
          top=0;
        }else if(top>SMSIZE-MSIZE){
          top=SMSIZE-MSIZE;
        }
        //如果left<0,就拉回0, 如果left>SMSIZE-MSIZE，就拉回SMSIZE-MSIZE
        if(left<0){
          left=0;
        }else if(left>SMSIZE-MSIZE){
          left=SMSIZE-MSIZE;
        }
        $mask.css({
          top:top+"px",
          left:left+"px"
        })
        //同时要修改$lgDiv的背景图片位置：
        $lgDiv.css(
          "background-position",
          `${-left*16/7}px ${-top*16/7}px`
        )//大图片大小(800px)  16
         //中图片大小(350px)   7
      })
      
      //3.5 鼠标进入上层透明div，显示大图片，大图片背景图片跟随鼠标移动
    }
  })
}
})
