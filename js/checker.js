
// jQuery objects
//
var startButton = $('.hw4-start-button'), // 「開始掃描」按鈕
    results = $('.hw4-result'); // 「掃描結果」 table

// 垃圾社團列表
var junkGroups = [];

// 用 Ajax 自 http://spamgroup.tonyq.org/groups/jsonp 取得垃圾社團列表

$.getJSON("http://jsbin.com/wacadi/6", {}, function(data){ 
//$.getJSON("http://jsbin.com/jaziroja/1", {}, function(data){  

    // 將每筆資料的 GID 放進 junkGroups 陣列中。
    //
       data.forEach(function(record){
          junkGroups.push(record.GID);
       }); 
    // ...
    //
    startButton.removeAttr('disabled').removeClass('disabled');
});


// 設定 Facebook AppID
window.fbAsyncInit = function(){

  FB.init({
    appId: '1431676380422774', // 若可以，請換成自己的 App ID !
    status: true
  });

  // 比對每個使用者的 group 是否有在 junkGroups 中出現
  //
  startButton.click(function(){
    results.empty(); // 清除結果內容
    $('.hw4-complete').remove(); // 移除「掃描完成」

    // 1. 讓使用者登入此 Facebook App (FB.login)

    FB.login(function(response) {
     if (response.authResponse) {
       //alert('Welcome!  Fetching your information.... ');


       FB.api('/me', function(response) {
         //alert('Good to see you, ' + response.name + '.');
       });


       // 2. 以 FB.api 拿到使用者的 group 列表
       FB.api("/me/groups",function (response) {    
        if (response && !response.error) {
            var junkFlag = false;
            for(var i=0;i<response.data.length;i++){
              //alert(response.data[i].id+""+response.data[i].name);
              /* handle the result */
              // 拿到使用者 group 列表的 response 之後：

               for(var j=0;j<junkGroups.length;j++){
                  if(junkGroups[j] == response.data[i].id){
                    junkFlag = true;
                    //junkGroupsVerify.push(junkGroups[i]);
                    results.after('<div class="hw4-complete alert alert-info">掃描出垃圾社團:'+response.data[i].name+'</div>');
                    //alert(response.data[i].id+""+response.data[i].name);
                  }   
              }

            }

            if(junkFlag){
              results.after('<div class="hw4-complete alert alert-info">掃描完成</div>');
            }else{
              results.after('<div class="hw4-complete alert alert-info">掃描完成，恭喜您，您加入的社團沒有任何垃圾社團</div>');
            }

          
      }else{
          results.after('<div class="hw4-complete alert alert-info">掃描失敗</div>');
      }
    }
);


     } else {
        alert('User cancelled login or did not fully authorize.');
      }
   },{scope: 'user_groups' , return_scopes: true } );




  });
};