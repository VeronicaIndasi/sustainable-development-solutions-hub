// Fetch user-specific solutions and display them
document.addEventListener('DOMContentLoaded', function() {
    // Replace with actual user ID
    const userId = 1;

    fetch(`http://localhost:4000/solutions?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const userSolutionsList = document.getElementById('userSolutions');
            data.forEach(solution => {
                const li = document.createElement('li');
                li.innerHTML = `<h3>${solution.title}</h3><p>${solution.description}</p>`;
                userSolutionsList.appendChild(li);
            });
        });
});
