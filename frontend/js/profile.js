import { getCurrentUser } from './utils.js';


const token = localStorage.getItem("token");


document.addEventListener("DOMContentLoaded", () => {
  const followBtn = document.getElementById('follow-btn');
  const followersCountEl = document.getElementById('followers-count');
  const followingCountEl = document.getElementById('following-count');
  const postsCountEl = document.getElementById('posts-count');


  const currentUser = getCurrentUser();
  const currentUserId = currentUser ? currentUser._id : null;
  const targetUserId = getTargetUserIdFromURL();

  if (!targetUserId) {
    console.error("Missing target user ID in URL");
    return;
  }

  if (!currentUserId) {
    alert("You must be logged in to follow users.");
    if (followBtn) followBtn.style.display = 'none';
    return;
  }

  async function loadUserProfile() {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${targetUserId}`);
      if (!res.ok) throw new Error('Failed to load profile');
      const user = await res.json();

      // Fill profile info
      document.getElementById("profile-name").textContent = user.username;
      const bioEl = document.getElementById("profile-bio");
      bioEl.textContent = user.bio || "No bio available";

      const locationEl = document.getElementById("profile-location");
      const locationContainer = document.getElementById("profile-location-container");
      if (user.location) {
        locationEl.textContent = user.location;
        locationContainer.classList.remove("hidden");
      } else {
        locationContainer.classList.add("hidden");
      }

      const profileImageEl = document.getElementById("profile-image");
      if (user.profileImg) {
        profileImageEl.src = `http://localhost:5000${user.profileImg}`;
      } else {
        profileImageEl.src = "https://via.placeholder.com/150"; // improved fallback
      }




      // Followers / Following counts
      followersCountEl.textContent = user.followers.length;
      followingCountEl.textContent = user.following.length;


      // Follow button logic
      if (targetUserId === currentUserId) {
        followBtn.style.display = 'none'; // can't follow yourself
        return;
      }

      const isFollowing = user.followers.some(follower => follower._id === currentUserId);
      followBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';
      followBtn.disabled = false;

    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  async function loadUserPosts() {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/user/${targetUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load posts");

      const posts = await res.json();
      const container = document.getElementById("user-posts"); // ✅ Use existing div
      container.innerHTML = ""; // Clear previous posts

      posts.forEach(post => {
        postsCountEl.textContent = posts.length; // Update post count
        const postDiv = document.createElement('div');
        postDiv.className = "post-card";

        postDiv.innerHTML = `
        <div style="margin-bottom: 12px; font-weight: 600; font-size: 14px; color: #6e6e73;">
            <i class="far fa-calendar-alt" style="margin-right: 6px;"></i>
            ${new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p style="margin-bottom: 16px;">${post.content}</p>
        ${post.image ? `<img src="http://localhost:5000${post.image}" alt="post" style="width: 100%; border-radius: 12px; margin-bottom: 16px; object-fit: cover;" />` : ''}
        <div style="display: flex; gap: 20px; border-top: 1px solid #f0f0f0; padding-top: 12px; font-size: 14px; color: #6e6e73;">
            <span><i class="fas fa-heart" style="color: #e63946; margin-right: 4px;"></i> ${post.likes.length}</span>
            <span><i class="fas fa-comment" style="margin-right: 4px;"></i> ${post.comments.length}</span>
        </div>
      `;

        container.appendChild(postDiv); // ✅ Append to user-posts, not body
      });
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }



  followBtn?.addEventListener('click', async () => {
    followBtn.disabled = true;
    console.log('Sending follow/unfollow:', { currentUserId, targetUserId }); // Debug log

    try {
      const res = await fetch(`http://localhost:5000/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId }),
      });

      const data = await res.json();

      if (res.ok) {
        await loadUserProfile();
      } else {
        alert(data.msg || 'Action failed');
        followBtn.disabled = false;
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error);
      alert('Something went wrong.');
      followBtn.disabled = false;
    }
  });

  loadUserProfile();
  loadUserPosts();

  const editBtn = document.getElementById("editProfileBtn");

  if (targetUserId === currentUserId) {
    editBtn.style.display = "block";

  }

  editBtn.addEventListener("click", () => {
    document.getElementById("editProfileForm").style.display = "block"

  });

  document.getElementById("editProfileForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formername = document.getElementById("profile-name").innerHTML;
    const formeremail = document.getElementById("profile-email").innerHTML;
    const formerlocation = document.getElementById("profile-location").innerHTML;
    const formerbio = document.getElementById("profile-bio").innerHTML;


    const formData = new FormData();
    formData.append("username", document.getElementById("editUsername").value || formername);
    formData.append("email", document.getElementById("editEmail").value || formeremail);
    formData.append("location", document.getElementById("editLocation").value || formerlocation);
    formData.append("bio", document.getElementById("editBio").value || formerbio);

    const imageInput = document.getElementById("editProfileImg");
    if (imageInput.files.length > 0) {
      formData.append("profileImg", imageInput.files[0]);
    }

    const res = await fetch(`http://localhost:5000/api/users/${targetUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated!");
      const updatedUser = await res.json();

      // Update the profile image src immediately
      const profileImageEl = document.getElementById("profile-image");
      if (updatedUser.profileImg) {
        // Add a cache-buster query param to avoid browser caching old image
        profileImageEl.src = `http://localhost:5000${updatedUser.profileImg}?t=${Date.now()}`;
      }
      location.reload();
    } else {
      alert("Error: " + data.message);
    }
  });

});



function getTargetUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

