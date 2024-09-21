function loadUserSolutions() {
    const userId = 1; 
    fetch(`http://localhost:4000/users/${userId}/solutions`)
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
}

function loadAvailableSolutions() {
    fetch('http://localhost:4000/solutions')
        .then(response => response.json())
        .then(data => {
            const solutionsList = document.getElementById('solutions');
            solutionsList.innerHTML = ''; 

            data.forEach(solution => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${solution.title}</h3>
                    <p>${solution.description}</p>
                    <button onclick="upvoteSolution(${solution.id})">Upvote</button>
                    <button onclick="openCommentForm(${solution.id})">Comment</button>
                    <div id="comments-${solution.id}"></div>
                `;
                solutionsList.appendChild(li);
                loadComments(solution.id); 
            });
        })
        .catch(error => console.error('Error loading available solutions:', error));
}

document.getElementById('solutionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const userId = 1; 

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

function upvoteSolution(solutionId) {
    const userId = 1; 
    fetch('http://localhost:4000/upvote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ solution_id: solutionId, user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadAvailableSolutions(); 
    })
    .catch(error => console.error('Error upvoting solution:', error));
}

function openCommentForm(solutionId) {
    const commentForm = document.createElement('form');
    commentForm.innerHTML = `
        <input type="text" id="commentText-${solutionId}" placeholder="Add a comment" required>
        <button type="submit">Submit</button>
    `;
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitComment(solutionId);
    });
    
    document.getElementById(`comments-${solutionId}`).appendChild(commentForm);
}

function submitComment(solutionId) {
    const commentText = document.getElementById(`commentText-${solutionId}`).value;
    const userId = 1; 

    fetch('http://localhost:4000/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ solution_id: solutionId, user_id: userId, text: commentText })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadAvailableSolutions(); 
    })
    .catch(error => console.error('Error submitting comment:', error));
}

function loadComments(solutionId) {
    fetch(`http://localhost:4000/comments/${solutionId}`)
        .then(response => response.json())
        .then(comments => {
            const commentsDiv = document.getElementById(`comments-${solutionId}`);
            commentsDiv.innerHTML = ''; 
            
            comments.forEach(comment => {
                const p = document.createElement('p');
                p.textContent = comment.text;
                commentsDiv.appendChild(p);
            });
        })
        .catch(error => console.error('Error loading comments:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadUserSolutions();
    loadAvailableSolutions();
});
