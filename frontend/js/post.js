

const token = localStorage.getItem("token");




document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = document.getElementById("postContent").value.trim();
  const file = document.getElementById("postImage").files[0];

  if (!content && !file) {
    alert("Please enter some text or upload an image.");
    return;
  }

  const formData = new FormData();
  formData.append("content", content);
  if (file) formData.append("image", file);

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) throw new Error("Failed to create post");

    await res.json(); // optional if you want to use returned post

    // Redirect so feed.html reloads posts
    window.location.href = "feed.html";
  } catch (err) {
    console.error(err);
    alert("Error creating post");
  }
});




function renderPost(post) {
  const postEl = document.createElement("div");
  postEl.classList.add("post");

  const token = localStorage.getItem("token");
  const isLiked = post.likes.includes(JSON.parse(atob(token.split(".")[1])).id);

  const commentsHTML = post.comments
    .map(
      (c) => `<li><strong>${c.userId?.username || "User"}:</strong> ${c.text}</li>`
    )
    .join("");

  // Build post HTML
  let postHTML = `
    <a href="profile.html?id=${post.userId?._id}">${post.userId?.username || "User"}</a>
    <p>${post.content}</p>
  `;

  // Add image if present
  if (post.image) {
    postHTML += `
      <img src="http://localhost:5000${post.image}" alt="Post image" style="max-width:100%;" />
    `;
  }

  postHTML += `
    <button class="like-btn "><i class="fas fa-like"></i>${isLiked } (${post.likes.length})</button>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    <ul>${commentsHTML}</ul>
    <input type="text" class="comment-input" placeholder="Add a comment..." />
    <button class="comment-btn">Comment</button>
  `;

  postEl.innerHTML = postHTML;

  // Attach event listeners
  postEl.querySelector(".like-btn").addEventListener("click", () => toggleLike(post._id, isLiked));
  postEl.querySelector(".edit-btn").addEventListener("click", () => editPost(post._id, post.content));
  postEl.querySelector(".delete-btn").addEventListener("click", () => deletePostHandler(post._id));
  postEl.querySelector(".comment-btn").addEventListener("click", () => {
    const input = postEl.querySelector(".comment-input");
    addCommentWithInput(post._id, input.value);
  });

  document.getElementById("posts").prepend(postEl);
}







// Function to update a post
async function updatePost(id, content) {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  return data;
}

function editPost(postId, currentContent) {
  const newContent = prompt("Edit your post:", currentContent);
  if (newContent && newContent !== currentContent) {
    updatePost(postId, newContent).then(() => loadPosts());
  }
}


//function to delete post
async function deletePost(id) {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

function deletePostHandler(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    deletePost(postId).then(() => loadPosts());
  }
}
