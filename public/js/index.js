(function(){
  //向localhost:3000/index发送请求，获得数据
  $.ajax({
    url:"http://localhost:3000/index",
    type:"get",//请求类型
    //无请求参数
    dataType:"json"//返回值类型
  })//.then中的函数会在请求结束后，自动执行
  //        open(result)
  //               ↓
  .then(function(result){
    console.log(result);
    //先取出结果数组中第一个商品
    var p1=result[0];
    //将p1的属性，填充进HTML片段中
    var html=`<div class="card border-0 flex-md-row box-shadow h-md-250">
      <div class="card-body d-flex flex-column align-items-start">
        <h5 class="d-inline-block mb-2">${p1.title}</h5>
        <h6 class="mb-5">
          <a class="text-dark" href="javascript:;">${p1.details}</a>
        </h6>
        <span class="text-primary">¥${p1.price.toFixed(2)}</span>
        <a class="btn btn-primary" href="${p1.href}">查看详情</a>
      </div>
      <img class="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="${p1.pic}" data-holder-rendered="true">
    </div>`;
    //放回页面中原位置:
    document.getElementById("p1")
            .innerHTML=html;

    //从结果集合中取出第二个商品
    var p2=result[1];
    //将p2的属性填充到HTML片段中:
    var html=`<div class="card border-0 flex-md-row box-shadow h-md-250">
      <div class="card-body d-flex flex-column align-items-start">
        <h5 class="d-inline-block mb-2">${p2.title}</h5>
        <h6 class="mb-5">
          <a class="text-dark" href="javascript:;">${p2.details}</a>
        </h6>
        <span class="text-primary">¥${p2.price.toFixed(2)}</span>
        <a class="btn btn-primary" href="${p2.href}">查看详情</a>
      </div>
      <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="${p2.pic}" data-holder-rendered="true">
    </div>`;
    //放回原位置去
    document.getElementById("p2")
            .innerHTML=html;
  })
})()