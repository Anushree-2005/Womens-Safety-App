document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
  
    // Function to set "Track Me" as default
    function setDefaultView() {
      displayLocation(); // Call the "Track Me" functionality by default
    }
  
    // Function to display the user's current location
    function displayLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Display the map with location
          mainContent.innerHTML = `
            <iframe 
              width="100%" 
              height="100%" 
              frameborder="0" 
              style="border:0;" 
              src="https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed">
            </iframe>
            <button id="send-sms-btn" class="track-me-btn">Send Location via SMS</button>
          `;
  
          // Send SMS when the button is clicked
          document.getElementById("send-sms-btn").onclick = () => sendSMS(latitude, longitude);
        });
      } else {
        mainContent.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
      }
    }
  
    // Function to send SMS with location
    function sendSMS(latitude, longitude) {
      const message = `I am at https://www.google.com/maps?q=${latitude},${longitude}. Please check my location.`;
      alert(`SMS Sent: ${message}`);
      // Integrate an SMS API here if needed
    }
  
    // Function to display SOS
    document.getElementById("sosButton").addEventListener("click", function () {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(sendSOS, showError);
      } else {
          alert("Geolocation is not supported by this browser.");
      }
  });
  
  function sendSOS(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
  
      fetch("/sendSOS", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              userId: "12345", // Replace with logged-in user ID
              name: "Pratiksha", // Replace with actual user name
              phone: "8484053364", // Replace with user phone
              email: "riddhiambadaskar@gmail.com", // Replace with user email
              latitude: latitude,
              longitude: longitude,
          }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("SOS Alert Sent Successfully!");
          } else {
              alert("Failed to send SOS.");
          }
      })
      .catch(error => console.error("Error:", error));
  }
  
  function showError(error) {
      alert("Location access denied! Please enable GPS.");
  }
  
  
    // Function to display a fake call
  
    // Functions for panic alarm and recording
    // function panicAlarm() {
    //   mainContent.innerHTML = `<h2>Panic Alarm Activated</h2>`;
    // }
    // Function to activate the panic alarm
function panicAlarm() {
  const mainContent = document.getElementById("main-content");

  // Set the main content to display a panic alarm message
  mainContent.innerHTML = `
    <h2>Panic Alarm Activated!</h2>
    <p>The alarm is sounding to alert nearby people.</p>
    <button id="stop-alarm-btn" class="stop-alarm-btn">Stop Alarm</button>
  `;

  // Play the alarm sound
  const alarmSound = new Audio("./assets/security-alarm-63578.mp3"); // Sample alarm sound
  alarmSound.loop = true;
  alarmSound.play();

  // Stop the alarm when the "Stop Alarm" button is clicked
  document.getElementById("stop-alarm-btn").onclick = () => {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset the alarm sound
    mainContent.innerHTML = `
      <h2>Panic Alarm Stopped</h2>
      <p>You can activate it again if needed.</p>
    `;
  };
}

// Attach event listener for the Panic Alarm footer button
document.getElementById("panic-alarm").addEventListener("click", panicAlarm);

      
  


//..recording function
let mediaRecorder;
let recordedChunks = [];
let currentStream;
let isRecording = false;

// Function to start recording
async function startRecording(cameraType = "user") {
  const mainContent = document.getElementById("main-content");
  try {
    // Get user media for the specified camera type
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraType },
      audio: true,
    });

    // Display a live video preview
    const videoElement = document.createElement("video");
    videoElement.srcObject = currentStream;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.style.width = "100%";
    videoElement.style.borderRadius = "10px";
    mainContent.innerHTML = "";
    mainContent.appendChild(videoElement);

    // Set up MediaRecorder
    mediaRecorder = new MediaRecorder(currentStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      // Combine the recorded chunks into a single Blob
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      recordedChunks = [];

      // Upload the blob to the server
      uploadRecording(blob);

      // Stop all tracks
      currentStream.getTracks().forEach((track) => track.stop());

      mainContent.innerHTML = `<p>Recording saved successfully!</p>`;
    };

    // Start recording
    mediaRecorder.start();
    isRecording = true;
    mainContent.innerHTML += `<button id="stop-recording-btn" class="stop-btn">Stop Recording</button>`;

    // Add stop button functionality
    document.getElementById("stop-recording-btn").onclick = stopRecording;
  } catch (error) {
    mainContent.innerHTML = `<p>Error accessing media devices: ${error.message}</p>`;
  }
}

// Function to stop recording
function stopRecording() {
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}

// Function to upload the recording to the server
async function uploadRecording(blob) {
  const formData = new FormData();
  formData.append("video", blob, "recording.webm");

  try {
    const response = await fetch("/upload-recording", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      console.log("Recording uploaded successfully!");
    } else {
      console.error("Failed to upload recording.");
    }
  } catch (error) {
    console.error("Error uploading recording:", error);
  }
}

// Attach event listener for the Record button
document.getElementById("record").addEventListener("click", () => {
  startRecording("user"); // Default to front camera
});

    // function startRecording() {
    //   mainContent.innerHTML = `<h2>Recording Started</h2>`;
    // }
  
    function fakeCall() {
      setTimeout(() => {
          document.getElementById("fakeCallScreen").style.display = "flex";
          document.getElementById("ringtone").play(); // Start ringtone
      }, 3000); // Delay to make it look real
  }
  
  function answerFakeCall() {
      document.getElementById("ringtone").pause();
      document.getElementById("fakeVoice").play(); // Play pre-recorded voice
  }
  
  function rejectFakeCall() {
      document.getElementById("ringtone").pause();
      document.getElementById("fakeVoice").pause(); // Pause pre-recorded voice

      document.getElementById("fakeCallScreen").style.display = "none"; // Hide fake call screen
  }
  
    // Attach event listeners to footer items
    document.getElementById("track-me").addEventListener("click", displayLocation);
    // document.getElementById("sos").addEventListener("click", startSOS);
    document.getElementById("fake-call").addEventListener("click", fakeCall);
    // document.getElementById("accept").addEventListener("click", answerFakeCall);
    // document.getElementById("reject").addEventListener("click", rejectFakeCall);

    
    document.getElementById("panic-alarm").addEventListener("click", panicAlarm);
    document.getElementById("record").addEventListener("click", startRecording);
  
    // Set "Track Me" as the default view
    setDefaultView();
  });
  