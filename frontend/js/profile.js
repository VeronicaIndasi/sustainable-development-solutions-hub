document.addEventListener('DOMContentLoaded', loadProfile);

function loadProfile() {
    fetch('/api/userProfile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('usernameDisplay').textContent = data.username;
            document.getElementById('nameDisplay').textContent = data.name;
            document.getElementById('emailDisplay').textContent = data.email;
            document.getElementById('bio').value = data.bio;
        })
        .catch(error => console.error('Error fetching profile:', error));
}

function editProfile() {
    const bio = document.getElementById('bio').value;

    const updatedProfile = {
        bio: bio
    };

    fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
    .then(response => response.json())
    .then(data => {
        alert('Profile updated successfully!');
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
    });
}


// backend connection
async function getUserProfile() {
    try {
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const profileData = await response.json();

        document.getElementById('nameDisplay').innerText = profileData.name;
        document.getElementById('usernameDisplay').innerText = profileData.username;
        document.getElementById('emailDisplay').innerText = profileData.email;
        document.getElementById('bio').value = profileData.bio;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

document.addEventListener('DOMContentLoaded', getUserProfile);
