
// function loadEmergencyAlerts() {
//     fetch("/getAlerts")
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 let alertsContainer = document.getElementById("alerts");
//                 alertsContainer.innerHTML = "";
                
//                 data.alerts.forEach(alert => {
//                     alertsContainer.innerHTML += `
//                         <div class="alert-card">
//                             <h3>${alert.name}</h3>
//                             <p><b>Phone:</b> ${alert.phone}</p>
//                             <p><b>Email:</b> ${alert.email}</p>
//                             <p><b>Location:</b> <a href="https://www.google.com/maps?q=${alert.latitude},${alert.longitude}" target="_blank">View on Map</a></p>
//                             <p><b>Time:</b> ${new Date(alert.timestamp).toLocaleString()}</p>
//                         </div>
//                     `;
//                 });
//             }
//         })
//         .catch(error => console.error("Error:", error));
// }

// // Auto-refresh alerts every 10 seconds
// setInterval(loadEmergencyAlerts, 10000);
// loadEmergencyAlerts();




// Search user profile
function searchUser(){
document.getElementById('searchBtn').addEventListener('click', function() {
    const userId = document.getElementById('userIdInput').value;

    if (!userId) {
        alert('Please enter a User ID');
        return;
    }

    fetch(`/get-user/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            
            // Populate the profile card
            document.getElementById('userImage').src = data.image_url || 'assets/blank-profile-picture.webp';
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userPhone').textContent = data.phone;
            document.getElementById('userEmail').textContent = data.email;
            document.getElementById('userRelation1').textContent = data.relation1;
            document.getElementById('Gphone1').textContent=data.Gphone1;
            document.getElementById('userRelation2').textContent = data.relation2;
            document.getElementById('Gphone2').textContent=data.Gphone2;



            // Show the profile section
            document.getElementById('userProfile').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching user:', error));
});
}