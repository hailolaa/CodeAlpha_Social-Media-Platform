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
      postEl.classList.add("post-card");

      const isLiked = post.likes.includes(JSON.parse(atob(token.split(".")[1])).id);

      const commentsHTML = post.comments
        .map(
          (c) => `<strong>${c.userId?.username || "User"}:</strong> ${c.text}</br>`
        )
        .join("");

      // Build post HTML
      let postHTML = `
        <div class="post-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; cursor: pointer;">
            <img src="${post.userId?.profileImg ? `http://localhost:5000${post.userId.profileImg}` : 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div class="name" style="font-weight: 600; font-size: 16px;">${post.userId?.username || "User"}</div>
        </div>
        <p style="margin-bottom: 16px;">${post.content}</p>  
      `;

      // Add image if present
      if (post.image) {
        postHTML += `
          <img src="http://localhost:5000${post.image}" alt="Post image" style="width: 100%; border-radius: 12px; margin-bottom: 16px; object-fit: cover;" />
        `;
      }

      postHTML += `
        <div class="post-actions" style="display: flex; align-items: center; gap: 20px; border-top: 1px solid #f0f0f0; padding-top: 15px;">
            <button class="like-btn" style="background: none; border: none; color: ${isLiked ? '#e63946' : '#6e6e73'}; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 500; padding: 0;">
                ${isLiked ? `<i class="fas fa-heart" style="font-size: 18px;"></i>` : `<i class="far fa-heart" style="font-size: 18px;"></i>`} 
                <span>${post.likes.length} Likes</span>
            </button>
            <div style="color: #6e6e73; font-size: 14px; font-weight: 500;">
                <i class="far fa-comment" style="font-size: 18px; margin-right: 6px;"></i>
                <span>${post.comments.length} Comments</span>
            </div>
        </div>
        
        <div class="comments-section" style="margin-top: 16px;">
            <div class="comments-list" style="max-height: 150px; overflow-y: auto; margin-bottom: 16px; font-size: 14px;">
                ${post.comments.map(c => `
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600;">${c.userId?.username || "User"}:</span> 
                        <span style="color: #444;">${c.text}</span>
                    </div>
                `).join("")}
            </div>
            <div style="display: flex; gap: 10px;">
                <input type="text" class="comment-input" placeholder="Add a comment..." style="flex: 1; padding: 10px 14px; border-radius: 10px; border: 1px solid #e5e5e7; font-size: 14px;" />
                <button class="comment-btn" style="background: #e63946; color: white; border: none; padding: 0 16px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">Send</button>
            </div>
        </div>
      `;

      postEl.innerHTML = postHTML;

      // Attach event listeners
      postEl.querySelector(".like-btn").addEventListener("click", () => toggleLike(post._id, isLiked));
      postEl.querySelector(".comment-btn").addEventListener("click", () => {
        const input = postEl.querySelector(".comment-input");
        addCommentWithInput(post._id, input.value);
      });
      postEl.querySelector(".post-header").addEventListener("click", () => {
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






