
const token = localStorage.getItem("token");

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Search failed");

    const users = await res.json();

    searchResults.innerHTML = users
      .map(user => `
        <div class="user-card search-result" data-id="${user._id}" style="cursor: pointer; margin-bottom: 12px;">
          <img src="${user.profileImg ? `http://localhost:5000${user.profileImg}` : 'https://via.placeholder.com/60'}" />
          <div class="user-info">
              <h4>${user.username}</h4>
              <p>${user.bio || 'Social Media Enthusiast'}</p>
          </div>
        </div>
      `).join("");

    document.querySelectorAll(".search-result").forEach(el => {
      el.addEventListener("click", () => {
        const userId = el.getAttribute("data-id");
        window.location.href = `profile.html?id=${userId}`;
      });
    });
  } catch (err) {
    console.error(err);
    searchResults.innerHTML = "<p>Error searching users</p>";
  }
});
