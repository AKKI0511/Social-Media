# Project Name

## Description
This project is a social networking platform frontend built using JavaScript, HTML, and CSS. It interacts with a Django backend to provide features like user authentication, post creation, profile management, and more.

## Table of Contents
- [Project Name](#project-name)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Features](#features)
    - [Functions Overview](#functions-overview)
       - [index.js](#Indexjs)
       - [Views.py](#Viewspy)

## Installation
To run this project locally, follow these steps:

1. Clone the repository to your local machine:
git clone https://github.com/username/repository-name.git

2. Open the project directory:
cd repository-name

3. run:
python manage.py runserver

## Usage
### Features
- **User Authentication:** Register, log in, and log out functionalities.
- **Post Creation:** Create new posts and edit your own posts.
- **Like Posts:** Like/Unlike posts.
- **Profile Management:** View your profile, follow/unfollow other users.
- **Pagination:** Posts are paginated for easier navigation.

### Functions Overview

## Index.js

### `document.addEventListener('DOMContentLoaded', () => { ... })`
- Description: Listens for the DOMContentLoaded event and initializes the application.
- Purpose: Ensures the JavaScript code runs after the HTML content is fully loaded.

### `createPostSection()`
- Description: Displays the new post creation section and hides other sections.
- Purpose: Provides a way for users to create new posts.

### `showSection(sectionId, pageNum)`
- Description: Displays the specified section and hides others based on sectionId and pageNum.
- Purpose: Handles navigation between different sections of the application.

### `fetchUserProfile()`
- Description: Fetches and displays the current user's profile information.
- Purpose: Shows user-related information such as followers, following, and user posts.

### `fetchPosts(sectionId, pageNum)`
- Description: Fetches and displays posts for the specified section and page number.
- Purpose: Retrieves posts data for all-post and Following sections for display.

### `displayPosts(data, sectionId)`
- Description: Displays posts in the specified section based on fetched data.
- Purpose: Renders post elements dynamically based on fetched post data.

### `createPostElement(post, current_user, sectionId, pageNum)`
- Description: Creates an HTML element for a post and adds necessary event listeners.
- Purpose: Generates HTML elements for each post to display on the UI.

### `showUserProfile(username)`
- Description: Shows user profile information for the specified username.
- Purpose: Displays user-related information and posts for a particular user.

### `createUserProfileElement(profile)`
- Description: Creates an HTML element for user profile and handles follow/unfollow functionality.
- Purpose: Generates user profile information and handles follow/unfollow actions.

### `createFollowButton(profile)`
- Description: Creates a Follow/Unfollow button for user profiles.
- Purpose: Provides a way for users to follow or unfollow other users.

### `displayUserPosts(posts, isCurrentUser)`
- Description: Displays posts for a user profile, includes edit button if it's the current user's profile.
- Purpose: Renders posts for a user's profile and enables editing for the current user's posts.

### `handleLikesUpdate(likes, sectionId, likelinkid, pageNum)`
- Description: Handles liking/unliking a post and updates the UI with the new like count.
- Purpose: Allows users to like or unlike a post and updates the UI accordingly.

### `toggleFollow(username)`
- Description: Toggles follow/unfollow for a user profile.
- Purpose: Enables users to follow or unfollow other users from their profiles.

### `addPaginationButton(label, sectionId, pageNum)`
- Description: Adds pagination buttons for navigating between pages of posts.
- Purpose: Facilitates navigation between pages of posts with pagination buttons.

### `toggleHeart(sectionId, likelinkid, pageNum)`
- Description: Toggles the heart icon for liking/unliking a post and updates the like count.
- Purpose: Handles the UI interaction for liking or unliking a post.

### `hideAllSections()`
- Description: Hides all sections of the application.
- Purpose: Ensures only the relevant section is displayed based on user interactions.

### `getCookie(name)`
- Description: Retrieves the value of a cookie by name.
- Purpose: Helps in obtaining the CSRF token for making authenticated requests.

### `EditButton(post, element, cnt)`
- Description: Creates an Edit button for a post and handles post editing functionality.
- Purpose: Enables users to edit their posts directly from the UI.

## Views.py

### `index(request)`
- Description: Renders the index.html template with a new form instance.
- Purpose: Displays the main page of the application with a form for creating new posts.

### `login_view(request)`
- Description: Handles user login functionality, authenticates users, and redirects them to the index page upon successful login.
- Purpose: Allows users to log in to the application securely.

### `logout_view(request)`
- Description: Logs out the currently authenticated user and redirects them to the index page.
- Purpose: Provides a way for users to log out of the application.

### `register(request)`
- Description: Handles user registration, creates a new user account, and logs in the user upon successful registration.
- Purpose: Enables new users to register for an account and access the application.

### `new_post(request)`
- Description: Allows authenticated users to create new posts by handling form submissions.
- Purpose: Provides a form for users to create and submit new posts.

### `edit_post(request, post_id)`
- Description: Handles the editing of a specific post identified by post_id, including updating the post content and handling likes.
- Purpose: Allows users to edit their posts and interact with post likes.

### `my_profile(request)`
- Description: Fetches and returns the profile information of the currently authenticated user.
- Purpose: Displays the profile information of the logged-in user.

### `profile(request, username)`
- Description: Handles user profile views, including following/unfollowing users and fetching profile information.
- Purpose: Provides functionality to view and interact with user profiles.

### `all_posts(request, page_number)`
- Description: Retrieves and paginates all posts in the system, ordered by timestamp.
- Purpose: Displays a paginated list of all posts in the application.

### `following(request, page_number)`
- Description: Retrieves and paginates posts from users that the current user is following.
- Purpose: Displays a paginated list of posts from users the logged-in user follows.

