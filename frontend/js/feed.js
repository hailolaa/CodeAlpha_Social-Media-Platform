const token = localStorage.getItem("token");



document.getElementById("allBtn").addEventListener("click", () => loadPosts("all"));
document.getElementById("timelineBtn").addEventListener("click", () => loadPosts("timeline"));
const postsContainer = document.getElementById("posts");

async function loadPosts(type = "all") {

  try {
  const endpoint = type === "timeline" ? "timeline" : "all";
  const res = await fetch(`http://localhost:5000/api/posts/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

    const data = await res.json();

    postsContainer.innerHTML = "";

    data.forEach((post) => {
      
      const postEl = document.createElement("div");
      postEl.classList.add("post");

      const isLiked = post.likes.includes(JSON.parse(atob(token.split(".")[1])).id);

      const commentsHTML = post.comments
        .map(
          (c) => `<strong>${c.userId?.username || "User"}:</strong> ${c.text}</br>`
        )
        .join("");

      // Build post HTML
      let postHTML = `
        <p class="name">${post.userId?.username || "User"}</p>
        <p>${post.content}</p>  
      `;

      // Add image if present
      if (post.image) {
        postHTML += `
          <img src="http://localhost:5000${post.image}" alt="Post image" style="max-width:100%;" />
        `;
      }

      postHTML += `
        <button class="like-btn">${isLiked ? `<i class="fas fa-heart"></i>` : `<i class="far fa-heart"></i>`} (${post.likes.length})</button>
        <ul>${commentsHTML}</ul>
        <input type="text" class="comment-input" placeholder="Add a comment..." />
        <button class="comment-btn">Comment</button>
      `;

      postEl.innerHTML = postHTML;

      // Attach event listeners
      postEl.querySelector(".like-btn").addEventListener("click", () => toggleLike(post._id, isLiked));
      postEl.querySelector(".comment-btn").addEventListener("click", () => {
        const input = postEl.querySelector(".comment-input");
        addCommentWithInput(post._id, input.value);
      });
      postEl.querySelector(".name").addEventListener("click", () => {
        window.location.href = `profile.html?id=${post.userId._id}`;
      });
      


     

      postsContainer.appendChild(postEl);
    });
  } catch (err) {
    alert("Error loading posts");
  }

}

export default { loadPosts };

  
loadPosts();






// Helper for comment input
function addCommentWithInput(postId, text) {
  if (!text.trim()) return alert("Comment cannot be empty");
  addComment(postId, text);
}

// Update addComment to accept text
async function addComment(postId, text) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    if (res.ok) {
      loadPosts(); // refresh to show new comment
    } else {
      alert(data.error || data.message);
    }
  } catch (err) {
    alert("Error commenting on post");
  }
}


// Function to toggle like on a post

async function toggleLike(postId, isLiked) {
  const token = localStorage.getItem("token");
  const endpoint = isLiked ? "unlike" : "like";

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      loadPosts(); // re-render posts to reflect changes
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    alert("Error toggling like");
  }
}






