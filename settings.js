document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById("content");
    const sidebarProfilePicture = document.getElementById("sidebar-profilePicture");
  
    const DEFAULT_PROFILE_PICTURE = "default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
  
    // Load Profile Content
    const loadProfileContent = () => {
      contentDiv.innerHTML = `
        <h2>Edit Profile Picture</h2>
        <div class="profile-picture-container">
            <img id="profilePicturePreview"
                src="${localStorage.getItem("profilePicture") || DEFAULT_PROFILE_PICTURE}"
                alt="Profile Picture Preview" class="profile-picture">
        </div>
        <div class="upload-section">
            <label for="profilePictureInput" class="upload-label">Choose a New Picture:</label>
            <input type="file" id="profilePictureInput" accept="image/*" class="upload-input">
            <button id="updateProfilePicture" class="btn">Update Picture</button>
        </div>
      `;
  
      const profilePictureInput = document.getElementById("profilePictureInput");
      const profilePicturePreview = document.getElementById("profilePicturePreview");
      const updateButton = document.getElementById("updateProfilePicture");
  
      profilePictureInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2 MB. Please upload a smaller file.");
            return;
          }
          if (!file.type.startsWith("image/")) {
            alert("Invalid file type. Please upload an image.");
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            profilePicturePreview.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
  
      updateButton.addEventListener("click", () => {
        const file = profilePictureInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageData = reader.result;
            profilePicturePreview.src = imageData;
            localStorage.setItem("profilePicture", imageData);
            sidebarProfilePicture.src = imageData;
            alert("Profile picture updated successfully!");
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select an image.");
        }
      });
    };
  
    // Load Settings Content
    const loadSettingsContent = () => {
      contentDiv.innerHTML = `
        <div class="edit">
            <h2>Edit Account Details</h2>
        </div>
        <form id="settingsForm" class="settings-form">
            <div class="form-group">
                <label for="settingsEmail">Email</label>
                <input type="email" id="settingsEmail"
                    value="${localStorage.getItem("userEmail") || ""}" required>
            </div>
            <div class="form-group">
                <label for="settingsPassword">Password</label>
                <input type="password" id="settingsPassword"
                    value="${localStorage.getItem("userPassword") || ""}" required>
            </div>
            <button type="submit" class="btn">Save Changes</button>
        </form>
      `;
  
      const settingsForm = document.getElementById("settingsForm");
      settingsForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const updatedEmail = document.getElementById("settingsEmail").value;
        const updatedPassword = document.getElementById("settingsPassword").value;
  
        if (!updatedEmail.includes("@")) {
          alert("Please enter a valid email address.");
          return;
        }
        if (updatedPassword.length < 6) {
          alert("Password must be at least 6 characters long.");
          return;
        }
  
        localStorage.setItem("userEmail", updatedEmail);
        localStorage.setItem("userPassword", updatedPassword);
        alert("Account details updated successfully!");
      });
    };
  
    // Load content based on navigation
    document.querySelectorAll(".sidebar nav ul li").forEach((tab) => {
      tab.addEventListener("click", (event) => {
        const section = event.target.textContent.trim();
        if (section === "Home") {
          contentDiv.innerHTML = `<h1>Welcome to Study Planner</h1>`;
        } else if (section === "Classes") {
          loadProfileContent();
        } else if (section === "Tasks") {
          loadSettingsContent();
        }
      });
    });
  });
  