var config = {
  apiKey: 'ClNkaq2f0rFRlMhCLuLhR1bS6JftLqEyuKncHbBC',
  databaseURL: 'https://carpoolproject.firebaseio.com',
};

firebase.initializeApp(config);
var currentConnectedFriends = {};
var currentLat;
var currentLng;

function getCoordinates(){
  var friendCoords = [];
  for(var key in currentConnectedFriends){
    friendCoords.push(currentConnectedFriends[key])
  }
  console.log(friendCoords);
  return friendCoords;
}

$("#add-friend-button").click(function(){
   var friendUsername = $("#friend-username").val();
  
   var query = firebase.database().ref("users").orderByKey();
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var val = childSnapshot.val()
          if(childSnapshot.getKey() == friendUsername){
            currentConnectedFriends[friendUsername] = val;
            updateFriendList();
            
          }
      });
    });
});


$("#login-button").click(function(){
   
    var username = $("#username").val();
    $("#username-display").text(username);
    initGeolocation(function(pos){
      firebase.database().ref("users/" + username).set(pos);
    });
    var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
              center: {lat: 37.313, lng: -122.029},
              zoom: 12
     });
     var marker = new google.maps.Marker({
            position: {lat: 37.313, lng: -122.029},
            map: map,
            title: 'You'
        });
    
    var numseat = $("#numseat").val();
    $("#numseat-display").text(numseat);
    firebase.database().ref("users/" + username).update({"numseat":numseat});
    
});

$("#nearestfriend").click(function(){
    findNearestFriend();
    console.log("nearestfriend pressed");
    
})

$("#removefriend").click(function(){
    removeFriend();
    console.log("removefriend pressed");
    
})

function updateFriendList(){
    var friendListHTML = "";
    var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
              center: {lat: 37.313, lng: -122.029},
              zoom: 12
     });
     var marker = new google.maps.Marker({
            position: {lat: 37.313, lng: -122.029},
            map: map,
            title: 'You'
        });
    for(var key in currentConnectedFriends){
      friendListHTML += '<li>Name: ' + key + ', Location: ' + currentConnectedFriends[key] + ' </li>';
      var temp = currentConnectedFriends[key].split(" ");
      console.log(temp[0]+"   "+temp[1]);
      var marker = new google.maps.Marker({
            position: {lat:parseFloat(temp[0]), lng:parseFloat(temp[1])},
            map: map,
            title: key
          
      });
    //   console.log(currentConnectedFriends[key]);
    }
    
    //print out friendListHTML
    $("#friends-list-view").html(friendListHTML);
}


function initMap() {
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
              center: {lat: 37.313, lng: -122.029},
              zoom: 12
            });
            
}
          
function initGeolocation(success)
 {
    if( navigator.geolocation )
    {
       // Call getCurrentPosition with success and failure callbacks
       navigator.geolocation.getCurrentPosition(function(pos){
         currentLat = pos.coords.latitude;
         currentLng = pos.coords.longitude;
         success(pos.coords.latitude + " " +  pos.coords.longitude);
         
       }, function(){
         alert("could not get geolocation");
       });
    }
    else
    {
       alert("Sorry, your browser does not support geolocation services.");
    }
 }
 
 function findNearestFriend(){
     var lowest = 10000000000;
     var swag = "";
    for (var key in currentConnectedFriends){
        var temp = currentConnectedFriends[key].split(" ");
        if (Math.sqrt(Math.pow(parseFloat(temp[0])-currentLat,2)+Math.pow(parseFloat(temp[1])-currentLng,2))<lowest) {
            lowest = Math.sqrt(Math.pow(parseFloat(temp[0])-parseFloat(currentLat),2)+Math.pow(parseFloat(temp[1])-parseFloat(currentLng),2));
            swag = key;
        }
    }
    lowest=lowest*68.703;
    window.alert(swag+" is the nearest friend. He/She is "+lowest+" miles away")
}
 
 function removeFriend(){
    var friend = window.prompt("Remove this friend:","(friend name)");
    var found=false;
    for (var key in currentConnectedFriends){
        if(key==friend){
            delete currentConnectedFriends[key];
            updateFriendList();
            found=true;
        }
        
    }
    if(!found){
        alert("Friend not found. :(")
    }
   
   
}
 
 //implement google maps api and add pinpoints to each of the friends coordinates by accessing the "getCoordinates()" method(returns an array of coordinates with lat and long separated by a space)
 //make website look fancy( add css and shit)
 
 

 //ur code goes here