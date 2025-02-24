function searchUser() {
    let userid = document.getElementById("userid").value;

    fetch(`http://localhost:5000/getUser/${userid}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById("userid").innerHTML = `
                    <p><strong>Name:</strong> ${data[0].name}</p>
                    <p><strong>Email:</strong> ${data[0].email}</p>
                    <p><strong>Phone:</strong> ${data[0].phone}</p>
                `;
            } else {
                document.getElementById("userid").innerHTML = "<p>No user found.</p>";
            }
        })
        .catch(error => console.error("Error fetching user:", error));
}