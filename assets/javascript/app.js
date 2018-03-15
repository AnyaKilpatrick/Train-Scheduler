
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBx-CqbRhUCw3eVByMPypojbFgMurS-8tc",
    authDomain: "myfirsttrainscheduler.firebaseapp.com",
    databaseURL: "https://myfirsttrainscheduler.firebaseio.com",
    projectId: "myfirsttrainscheduler",
    storageBucket: "",
    messagingSenderId: "1044035882495"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Initial Variables
var trainname;
var destination;
var frequency;
var arrival;
var away;

// OBJECT
var scheduler = {

  addTrain: function(){
    $("#addTrain").on("click", function(){
      event.preventDefault();
    
      trainname = $("#inputName").val().trim();
      destination = $("#inputDestination").val().trim();
      frequency = $("#inputFrequency").val().trim();
      arrival = $("#inputTime").val().trim();
      console.log(trainname);
    
      database.ref().push({
        name: trainname,
        destination: destination,
        frequency: frequency,
        arrival: arrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      })
    })
  },

  addInfo: function(){
    database.ref().on("child_added", function(childSnapshot) {
    
      var childTime = childSnapshot.val().arrival; //military time
      var parseTime = moment(childTime, "LT"); // time in miliseconds
    
      var childFrequency = childSnapshot.val().frequency;
      var parseFrequency = moment(childFrequency, "m");
    
      var now = moment();
      var minutesAway = parseTime.diff(now, "minutes");//calculates the difference between "now" time and "next arrival" time
    
      if (minutesAway === 0){ //if "now"time is the same as "arrival" time, then..
        console.log("you missed your train");
        console.log("arrival time: "+childTime);
        console.log("first arrival: "+ childSnapshot.val().arrival);
        childTime = moment(childTime, 'LT').add(childFrequency, 'minutes').format("LT"); //add frequency (min) to "arrival" time
        
        
        parseTime = moment(childTime, "LT") //update var values
        minutesAway = parseTime.diff(now, "minutes");
        console.log("new arrival time: !!!" + childTime);
        console.log("first arrival time: "+ childSnapshot.val().arrival);
    }
      $("#trainInfo").append(`
          <tr>
          <td>${childSnapshot.val().name}</td>
          <td>${childSnapshot.val().destination}</td>
          <td>${childSnapshot.val().frequency}</td>
          <td>${childTime}</td>
          <td>${minutesAway}</td>
          </tr>
      
      `)
      // If any errors are experienced, log them to console.
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
  }

}

scheduler.addTrain();
scheduler.addInfo();




// var t;
// $(document).ready(function(){
//   t = setInterval(childSnapshot,60000);
// })