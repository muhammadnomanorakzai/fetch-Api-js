const form = document.getElementById("form");
const userInfo = document.getElementById("userInfo");
const postsContainer = document.getElementById("posts");
const loading = document.getElementById("loading");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = document.getElementById("userId").value;

  async function fetchUser(userId) {
    loading.style.display = "block"; // Show spinner
    userInfo.innerHTML = "";
    postsContainer.innerHTML = "";

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      if (!response.ok) throw new Error("User not found");
      const user = await response.json();

      userInfo.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">User ID: ${user.id}</h5>
            <p class="card-text"><strong>Name:</strong> ${user.name}</p>
            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
            <button id="getPostsBtn" class="btn btn-primary mt-2">Get User Posts</button>
          </div>
        </div>
      `;

      form.reset();

      document
        .getElementById("getPostsBtn")
        .addEventListener("click", function () {
          fetchUserPosts(user.id);
        });
    } catch (error) {
      userInfo.innerHTML = `
        <div class="alert alert-danger">User not found. Please enter a valid User ID.</div>
      `;
    } finally {
      loading.style.display = "none"; // Hide spinner
    }
  }

  async function fetchUserPosts(userId) {
    postsContainer.innerHTML = "";
    loading.style.display = "block"; // Show spinner

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      const posts = await response.json();

      if (posts.length === 0) {
        postsContainer.innerHTML = `<div class="alert alert-warning">No posts found for this user.</div>`;
        return;
      }

      postsContainer.innerHTML = `
        <h4 class="mt-4">Posts by User ${userId}</h4>
        ${posts
          .map(
            (post) => `
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${post.title}</h5>
                  <p class="card-text">${post.body}</p>
                </div>
              </div>
            `
          )
          .join("")}
      `;
    } catch (error) {
      postsContainer.innerHTML = `<div class="alert alert-danger">Failed to fetch posts.</div>`;
    } finally {
      loading.style.display = "none"; // Hide spinner
    }
  }

  fetchUser(userId);
});
