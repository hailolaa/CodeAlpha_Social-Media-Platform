
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
        <div class="search-result" data-id="${user._id}">
          <img src="${user.profileImg || '/default-avatar.png'}" width="40"/>
          <span>${user.username || user.name}</span>
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
