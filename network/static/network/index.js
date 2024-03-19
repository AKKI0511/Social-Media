document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for navigation
    document.querySelector('#newpost').addEventListener('click', () => createPostSection());
    document.querySelector('#profile').addEventListener('click', () => showSection('Profile', 1));
    document.querySelector('#allposts').addEventListener('click', () => showSection('all-post', 1));
    document.querySelector('#following').addEventListener('click', () => showSection("Following", 1));
    
    // Initially show all-post page
    showSection('all-post', 1);
});

// Show create-post section and hide others
function createPostSection(){
    hideAllSections();
    document.querySelector('#new-post').style.display = 'block';
}

// Show the specified section and hide others
function showSection(sectionId, pageNum){
    hideAllSections();
    document.querySelector(`#${sectionId}`).style.display = 'block';

    // Show the page name
    document.querySelector(`#${sectionId}`).innerHTML = `<h3>${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h3>`;

    // Handle different sections
    if(sectionId === "all-post" || sectionId === "Following"){
        fetchPosts(sectionId, pageNum);
    } else if(sectionId === "Profile"){
        fetchUserProfile();
    }
}

// Fetch and show current_user's profile (user who is logged in)
function fetchUserProfile(){
    // Current user logged-in
    let current_user = document.querySelector("#profile").getAttribute('data-username');

    fetch(`profile/${current_user}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(profile => {

    // Update HTML with follower and following counts
        let element = document.createElement("div")
        element.innerHTML = `<hr class="bg-light"><h3>${profile.username}</h3>
                            <p id="followers-count">Followers: ${profile.followers.length}</p>
                            <p id="following-count">Following: ${profile.following.length}</p>`
        document.querySelector("#Profile").append(element);

        // For loop to show all the posts of that user-profile
        for(const post of profile.posts){
            let element = document.createElement("div");
            element.className = "text-light";     
            var cnt = post.content;               
            element.innerHTML = `<hr class="bg-light">
                                <p>${cnt}<br>${post.likes} Likes</p>
                                ${post.timestamp}  `;
            
            // Edit button
            EditButton(post, element, cnt);
            document.querySelector("#Profile").append(element);
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Fetch and display posts for all-post and Following sections
function fetchPosts(sectionId, pageNum){
    fetch(`/${sectionId}/${pageNum}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Display posts
        displayPosts(data, sectionId);

        // Add pagination buttons if available
        if(data.prev_page){
            addPaginationButton('Prev', sectionId, data.prev_page);
        }
        if(data.next_page){
            addPaginationButton('Next', sectionId, data.next_page);
        }
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}

// Display posts in the specified section
function displayPosts(data, sectionId){
    const current_user = document.querySelector("#profile").getAttribute('data-username');
    const posts = data.post_info;
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        createPostElement(post, current_user, sectionId, data.page_num);
    }
}

// Create HTML element for a post
function createPostElement(post, current_user, sectionId, pageNum) {
    const element = document.createElement("div");
    const likes = document.createElement("div");
    const btn = document.createElement('div');
    element.className = "text-light";
    const profileLinkId = `profile-link-${post.id}`;
    const likelinkid = `like-link-${post.id}`;
    var cnt = post.content;
    const likeButtonStyle = post.liked_users.includes(current_user) ? 'heart-button-liked' : 'heart-button';
    element.innerHTML = `<hr class="bg-light">
                        <a class="nav-link" id="${profileLinkId}" data-username="${post.poster}">
                            <h3>${post.poster}</h3>
                        </a>
                        ${cnt}<br>
                        ${post.timestamp}  `;
    likes.innerHTML = `${post.likes} Likes`;
    btn.innerHTML = `<button type="button" class="btn ${likeButtonStyle}" id="${likelinkid}" data-postid="${post.id}">
                        <i class="fas fa-heart"></i>
                    </button>`;
    element.append(likes);
    element.append(btn);
    
    if(post.poster === current_user){
        EditButton(post, element, cnt);
    }
    document.querySelector(`#${sectionId}`).append(element);

    // Add event listeners if the elements exist
    const profileLinkElement = document.getElementById(profileLinkId);
    if (profileLinkElement) {
        profileLinkElement.addEventListener('click', () => showUserProfile(post.poster));
    }

    const likeLinkElement = document.getElementById(likelinkid);
    if (likeLinkElement) {
        likeLinkElement.addEventListener("click", () => {
            handleLikesUpdate(likes, sectionId, likelinkid, pageNum);
        });
    }
}

// Show user profile for the specified username
function showUserProfile(username){
    console.log('profile');
    hideAllSections();
    document.querySelector(`#Profile`).style.display = 'block';
    document.querySelector(`#Profile`).innerHTML = '';

    fetch(`/profile/${username}`)
    .then(response => response.json())
    .then(profile => {
        createUserProfileElement(profile);
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Create HTML element for user profile
function createUserProfileElement(profile){
    const element = document.createElement("div");
    element.innerHTML = `<h3>Profile</h3><hr class="bg-light">
                        <h3>${profile.username}</h3>
                        <p id="followers-count">Followers: ${profile.followers.length}</p>
                        <p id="following-count">Following: ${profile.following.length}</p>`;
    document.querySelector("#Profile").append(element);

    const current_user = document.querySelector("#profile").getAttribute('data-username');
    if(!(current_user === profile.username)){
        createFollowButton(profile);
    }
    const isCurrentUser = current_user === profile.username;
    displayUserPosts(profile.posts, isCurrentUser);
}

// Create Follow/Unfollow button for user profile
function createFollowButton(profile){
    const current_user = document.querySelector("#profile").getAttribute('data-username');
    const followBtn = document.createElement('button');
    followBtn.className = 'btn btn-primary';
    followBtn.innerHTML = (profile.followers.includes(current_user)) ? 'Unfollow' : 'Follow';
    followBtn.addEventListener('click', () => toggleFollow(profile.username));
    document.querySelector("#Profile").append(followBtn);
}

// Display posts in user profile
function displayUserPosts(posts, isCurrentUser){
    for(const post of posts){
        const element = document.createElement("div");
        element.className = "text-light";          
        var cnt = post.content;          
        element.innerHTML = `<hr class="bg-light">
                            <p>${cnt}<br>${post.likes} Likes</p>
                            ${post.timestamp}`;
        // Edit button
        if (isCurrentUser){
            EditButton(post, element, cnt);
        }
        document.querySelector("#Profile").append(element);
    }
}

// like/unlike post
async function handleLikesUpdate(likes, sectionId, likelinkid, pageNum) {
    const likesValue = await toggleHeart(sectionId, likelinkid, pageNum);
    if (likesValue !== null) {
        likes.innerHTML = likesValue + " Likes";
    } else {
        // Handle error or display appropriate message
        likes.innerHTML = 'Error updating likes';
    }
}

// Toggle Follow/Unfollow for a user
function toggleFollow(username){
    fetch(`/profile/${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => response.json())
    .then(update => {
        location.reload();
    })
    .catch(error => {
        console.error('Error toggling follow:', error);
    });
}

// Add pagination button
function addPaginationButton(label, sectionId, pageNum){
    const button = document.createElement("button");
    button.className = 'btn btn-primary';
    button.innerHTML = label;
    button.addEventListener('click', () => showSection(sectionId, pageNum));
    document.querySelector(`#${sectionId}`).append(button);
}

// Toggle like for a post
async function toggleHeart(sectionId, likelinkid, pageNum) {
    try {
        let el = document.getElementById(likelinkid);
        let postid = el.getAttribute('data-postid');

        const response = await fetch(`/posts/${postid}/edit/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                liked: true
            })
        });

        const reply = await response.json();
        el.classList.toggle('active');
        console.log(reply.likes);
        return reply.likes; // Return the value inside the async function
    } catch (error) {
        console.error('Error editing post:', error);
        return null; // Handle errors gracefully
    }
}

// Function to hide all sections
function hideAllSections(){
    const sections = ['Profile', 'all-post', 'new-post', 'Following'];
    sections.forEach(section => {
        document.querySelector(`#${section}`).style.display = 'none';
    });
}

// Get csrf_token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Create an Edit button for a post
function EditButton(post, element, cnt){
    // Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.className = "btn btn-sm btn-primary";
    editButton.addEventListener("click", function() {
        // Replace post content with textarea for editing
        let textarea = document.createElement("textarea");
        textarea.value = post.content;
        element.innerHTML = "<hr class='bg-light'>"; // Clear existing content
        element.appendChild(textarea);

        // Replace edit button with save button
        let saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.className = "btn btn-sm btn-primary";
        saveButton.addEventListener("click",async function() {
            const postId = post.id;  // Replace with the ID of the post you want to edit
            const newContent = textarea.value;  // Replace with the new content of the post

            const response = await fetch(`/posts/${postId}/edit/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token
                },
                body: JSON.stringify({
                    content: newContent
                })
            });
    
            const reply = await response.json();
            cnt = reply.post.content;
            location.reload();
        });
        element.appendChild(saveButton);
    });
    element.appendChild(editButton);
}