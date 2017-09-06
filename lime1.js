  //set momentJS locale
  moment.locale("zh-tw");
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBq5n4RDtC1sOUEnCF5ZFn8AEZCpsz3dS0",
    authDomain: "line-test2017.firebaseapp.com",
    databaseURL: "https://line-test2017.firebaseio.com",
    projectId: "line-test2017",
    storageBucket: "line-test2017.appspot.com",
    messagingSenderId: "341399460983"
  };
  firebase.initializeApp(config);

  $( document ).ready(function() {
     
      $(".msg-body").scrollTop( $(".msg-body").height()+100 );
  });

  var userLogin;
  
  firebase.auth().signInWithEmailAndPassword("twbbstsuna@gmail.com", "twbbstsuna");
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userLogin = user;
      console.log("User is logined", user);
      main();
    } else {
      userLogin = null;
      console.log("User is not logined yet.");
    }
  });

//現在的對象ＩＤ

const dateTime = Date.now();
const timestamp = Math.floor(dateTime / 1000);

var myname="";

var curRid = "";
var curOth_id = "";
var curOth_name = "";

function main(){

  $("#msgsubmit").click(function(){
    if ($("input#msginput").val()!="")
    {
    sendmsg(curMid,$("input#msginput").val());
    console.log($("input#msginput").val());
    console.log("DONE");
    $("input#msginput").val("");
    }
  });

  $("input#msginput").keypress(function(e){
    code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13&&$(this).val()!="")
    {
      sendmsg(curRid,$(this).val());
      console.log($(this).val());
      console.log("DONE");
      $(this).val("");}
    });
  

  //Get current logined user's information. 
  var userRef = firebase.database().ref('/user/'+userLogin.uid);
  userRef.on('value', function(snapshot) {
    $('#myinfo').empty();
    myname = snapshot.val().name;
    var myinfo ="";
    myinfo += "<span class=\"mdl-list__item-primary-content\">";
    myinfo += "<i class=\"material-icons mdl-list__item-avatar\">person</i>";
    myinfo += "<span>"+snapshot.val().name+"</span>";
    //myinfo += "<span class=\"mdl-list__item-sub-title\"><small>"+snapshot.val().status+"</small></span>";
    myinfo += "</span>";
    myinfo += "<span class=\"mdl-list__item-secondary-content\">"
    //myinfo += "<a class=\"mdl-list__item-secondary-action\" href=\"#\"><i class=\"material-icons\">edit</i></a>";
    myinfo += "</span>";
    $('#myinfo').append(myinfo);
    console.log("Info loaded.");
  }, function(error){console.log('Failed to load user\'s info: ');console.log(error);});



  //Get current logined user's friends. 
  var friRef = firebase.database().ref('/user/'+userLogin.uid+'/friends');
  friRef.on('value', function(snapshot) {
     
     $('#contact-panel').empty();
    snapshot.val().forEach(function(element) {
      var frilist ="";
      firebase.database().ref('/user/'+element).once('value', function(frinfo) {
        console.log('#'+frinfo.key);
        //$('a#'+frinfo.key).remove();
        frilist += "<a class=\"mdl-navigation__link mdl-js-ripple-effect mdl-list__item mdl-list__item--two-line Flist\" onclick=\"render_msg('"+frinfo.key+"','"+frinfo.val().name+"')\"  id=\""+frinfo.key+"\">";
        frilist += "<span class=\"mdl-list__item-primary-content\">";
        frilist += "   <i class=\"material-icons mdl-list__item-avatar\">person</i>";
        frilist += "   <span>"+frinfo.val().name+"</span>";
        //frilist += "   <span class=\"mdl-list__item-sub-title\"><small >"+frinfo.val().status+"</small></span>";
        frilist += "</span>";
        frilist += "</a>";
        
        $('#contact-panel').append(frilist);
      }, function(error){console.log('Failed to load friend user\'s info, ID='+element+': ');console.log(error);});
           
    }, this);
    console.log("Friends loaded.");
  }, function(error){console.log('Failed to load user\'s friends: ');console.log(error);});

}

//切換聊天室
function render_msg(id,name){
  curRid="";
  curOth_id="";
  curOth_name="";
  $('.msg-body').empty();
  $('.msg-body').append("<div class=\"mdl-spinner mdl-js-spinner is-active\"></div>");
  console.log(id);
  curOth_id = id;
  curOth_name = name;
  firebase.database().ref('/croom').once('value', function(room) {
    Object.keys(room.val()).reduce(function(index,key,wat) {
      
     if(($.inArray(userLogin.uid,room.val()[key])!=-1)&&($.inArray(curOth_id,room.val()[key])!=-1)){curRid=key;}
    },this);
  }).then(function(){
    firebase.database().ref('/message/'+curRid).on('value', function(msg) {
       $('.msg-body').empty();
      Object.keys(msg.val()).reduce(function(index,k) {
       
        //console.log(msg.val()[k].from);
        if(msg.val()[k].from==userLogin.uid){
          var msgnow="";
          msgnow += "<div class=\"row\" id=\"mid\">";
          msgnow += "  <div class=\"col-lg-1\"></div>";
          msgnow += "  <div class=\"col-lg-11\">";
          msgnow += "      <div class=\"media\">";
          msgnow += "          <div  class=\"media-body\" style=\"text-align:right\">";
          msgnow += "             <h5 class=\"mt-2\">"+myname+"　<small><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> "+moment.unix(msg.val()[k].timestamp).format('YYYY-MM-DD HH:mm:ss')+"</small></h5> ";                             
          msgnow += "              <div class=\"mdl-card mdl-shadow--2dp me\"  id=\"chatbox\">";
          msgnow += msg.val()[k].content;
          msgnow += "              </div>";
          msgnow += "          </div>";
          msgnow += "      </div>";
          msgnow += "  </div>";
          msgnow += "</div>";

        }else{
          var msgnow="";
          msgnow +=  "<div class=\"row\" id=\"mid\">";
          msgnow += "    <div class=\"col-lg-10\">";
          msgnow += "        <div class=\"media\">";
          msgnow += "            <i class=\"material-icons mdl-list__item-avatar\">person</i>";
          msgnow += "            <div  class=\"media-body\">";
          msgnow += "                <h5 class=\"mt-2\">　"+curOth_name+"<small>　<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> "+moment.unix(msg.val()[k].timestamp).format('YYYY-MM-DD HH:mm:ss')+"</small></h5>";
          msgnow += "                <div class=\"mdl-card mdl-shadow--2dp \"  id=\"chatbox\">";
          msgnow += msg.val()[k].content;
          msgnow += "                </div>";
          msgnow += "            </div>";
          msgnow += "        </div>";
          msgnow += "    </div>";
          msgnow += "</div>";
        }
        $('.msg-body').prepend(msgnow);
      },this);
  
    }, function(error){console.log('Failed to load msg: ');console.log(error);});
  });

  

}

//送出訊息
function sendmsg(rid,msg){
  var postRef = firebase.database().ref('/message/' + rid);
  postRef.push().set({
    from:       userLogin.uid,
    content:    msg,
    timestamp:  timestamp
}).then(function(){
  console.log("pushSuccess");
}).catch(function(err){
  console.error("pushFailed：",err);
})

}