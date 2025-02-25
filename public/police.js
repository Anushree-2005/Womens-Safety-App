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