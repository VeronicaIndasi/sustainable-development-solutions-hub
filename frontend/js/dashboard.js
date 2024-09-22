document.addEventListener('DOMContentLoaded', function () {
    const userId = 1;

    fetch(`http://localhost:4000/solutions?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const userSolutionsList = document.getElementById('userSolutions');
            userSolutionsList.innerHTML = '';  
            data.forEach(solution => {
                const li = document.createElement('li');
                li.innerHTML = `<h3>${solution.title}</h3><p>${solution.description}</p>`;
                userSolutionsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading user solutions:', error));

    document.getElementById('solutionForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        fetch('http://localhost:4000/solutions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Solution submitted:', data);
            loadAvailableSolutions();  
            loadUserSolutions();  
            document.getElementById('solutionForm').reset();  
        })
        .catch(error => console.error('Error submitting solution:', error));
    });

    function loadAvailableSolutions() {
        fetch('http://localhost:4000/solutions')
            .then(response => response.json())
            .then(data => {
                const solutionsList = document.getElementById('solutions');
                solutionsList.innerHTML = '';  

                data.forEach(solution => {
                    const li = document.createElement('li');
                    li.innerHTML = `<h3>${solution.title}</h3><p>${solution.description}</p>`;
                    solutionsList.appendChild(li);
                });
            })
            .catch(error => console.error('Error loading available solutions:', error));
    }

    loadAvailableSolutions();  
});
