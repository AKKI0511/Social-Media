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
    - [File Structure](#file-structure)
    - [Functions Overview](#functions-overview)

## Installation
To run this project locally, follow these steps:

1. Clone the repository to your local machine:
git clone https://github.com/username/repository-name.git


2. Open the project directory:
cd repository-name


3. Open the `index.html` file in your web browser to start using the application.

## Usage
### Features
- **User Authentication:** Register, log in, and log out functionalities.
- **Post Creation:** Create new posts and edit your own posts.
- **Profile Management:** View your profile, follow/unfollow other users.
- **Pagination:** Posts are paginated for easier navigation.

### File Structure
- **index.html:** Main HTML file for the project.
- **styles.css:** CSS file for styling the application.
- **script.js:** JavaScript file containing the frontend logic.
- **images:** Directory for storing images used in the project.

### Functions Overview
Here's a brief overview of key functions in `script.js`:

- **Event Listeners:** Handles navigation and page display.
- **createPostSection():** Displays the new post creation section.
- **showSection(sectionId, pageNum):** Shows different sections based on navigation.
- **fetchUserProfile():** Fetches and displays the current user's profile.
- **fetchPosts(sectionId, pageNum):** Fetches and displays posts based on the section.
- **createPostElement(post, current_user, sectionId, pageNum):** Creates HTML elements for a post.
- **showUserProfile(username):** Displays user profile for a specific username.
- **toggleFollow(username):** Toggles follow/unfollow for a user.
- **toggleHeart(sectionId, likelinkid, pageNum):** Handles liking/unliking a post.
- **EditButton(post, element, cnt):** Creates an edit button for a post.

