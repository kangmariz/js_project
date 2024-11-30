// Global Elements
const profileTab = document.getElementById("profileTab");
const elements = {
    profile: {
        pictureForm: document.getElementById('profile-picture-form'),
        pictureInput: document.getElementById('profile-picture-input'),
        settingsPicture: document.getElementById('settings-profile-picture'),
        sidebarPicture: document.getElementById('sidebar-profile-picture'),
        accountForm: document.getElementById('account-info-form'),
    },
    others: {
        greeting: document.getElementById('greeting'),
    },
};

// Load Profile Content
const loadProfileContent = () => {
    contentDiv.innerHTML = `
      <h2>Edit Profile Picture</h2>
      <div class="profile-picture-container">
          <img id="profilePicturePreview"
              src="${localStorage.getItem("profilePicture") || "default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}"
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

// Utility Functions
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

// Profile Functions
function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');

        if (nameField) nameField.value = currentUser.name;
        if (emailField) emailField.value = currentUser.email;
        if (passwordField) passwordField.value = currentUser.password;

        if (elements.profile.sidebarPicture) {
            elements.profile.sidebarPicture.src = currentUser.profilePicture || 'default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';
        }
        if (elements.profile.settingsPicture) {
            elements.profile.settingsPicture.src = currentUser.profilePicture || 'default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';
        }
    } else {
        console.warn('No current user found in localStorage.');
    }
}

// Update the saveProfile function
function saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let profilePicture = elements.profile.settingsPicture.src;

    // Check if a new profile picture is uploaded
    if (elements.profile.pictureInput.files[0]) {
        profilePicture = URL.createObjectURL(elements.profile.pictureInput.files[0]);
    }

    const updatedProfile = { name, email, password, profilePicture };

    // Save updated profile to local storage
    saveToLocalStorage('currentUser', updatedProfile);
    saveToLocalStorage('profile', updatedProfile); // Optional if needed

    // Update the profile pictures in the settings and sidebar
    elements.profile.sidebarPicture.src = updatedProfile.profilePicture;
    elements.profile.settingsPicture.src = updatedProfile.profilePicture;

    alert('Profile updated successfully!');
}

function logoutUser() {
    console.log('Logout button clicked.'); // Debugging log
    if (confirm('Are you sure you want to logout?')) {
        console.log('User confirmed logout.');

        // Save tasks and classes under the user's unique key
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Keep the user's tasks and classes data in local storage
            console.log('Tasks and classes data retained.');
        }

        // Clear the current user data
        localStorage.removeItem('currentUser'); // Clear the logged-in user's data

        // Clear the global session data without removing persistent data
        tasks = [];
        classes = [];

        // Redirect to the login page
        window.location.href = 'index.html';
    } else {
        console.log('User canceled logout.');
    }
}


// Greeting and Theme Toggle
function setGreeting() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentTime = new Date().getHours();
    let greeting = "Hello";
    let icon;
    let iconClass;

    if (currentUser) {
        if (currentTime < 12) {
            greeting = "Good morning";
            icon = '<i class="fas fa-sun icon day"></i>';
        } else if (currentTime < 18) {
            greeting = "Good afternoon";
            icon = '<i class="fas fa-sun icon day"></i>'; 
        } else {
            greeting = "Good evening";
            icon = '<i class="fas fa-moon icon night"></i>';
        }

        // Set the class dynamically for the greeting container
        elements.others.greeting.className = `greeting`;
        elements.others.greeting.innerHTML = `${icon} <span class="text">${greeting}, ${currentUser.name}!</span>`;
    } else {
        elements.others.greeting.className = "greeting"; // Default class for guests
        elements.others.greeting.innerHTML = '<i class="fas fa-sun icon day"></i> <span class="text">Hello, Guest!</span>';
    }
}



// Ensure the greeting is set when the page loads
document.addEventListener('DOMContentLoaded', setGreeting);

// Theme Toggle Functions
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.warn('No current user found.');
        return;
    }

    console.log('Loading user data...');

    // Load and render tasks
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.email}`)) || [];
    console.log('Loaded tasks:', savedTasks);

    // Load and render classes
    const savedClasses = JSON.parse(localStorage.getItem(`classes_${currentUser.email}`)) || [];
    console.log('Loaded classes:', savedClasses);
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    console.log('DOM fully loaded');
});

// Login and Signup Functions
function signUpUser(e) {
    e.preventDefault();

    const signUpName = document.getElementById('signup-name').value;
    const signUpEmail = document.getElementById('signup-email').value;
    const signUpPassword = document.getElementById('signup-password').value;

    if (!signUpName || !signUpEmail || !signUpPassword) {
        alert('All fields are required.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === signUpEmail)) {
        alert('Email already registered. Please log in.');
        return;
    }

    const newUser = { name: signUpName, email: signUpEmail, password: signUpPassword };
    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign up successful!');
    window.location.href = 'index.html'; // Redirect to login page
}

function loginUser(e) {
    e.preventDefault();

    const loginName = document.getElementById('login-name').value;
    const loginPassword = document.getElementById('login-password').value;

    if (!loginName || !loginPassword) {
        alert('All fields are required.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.name === loginName && u.password === loginPassword);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Welcome, ${user.name}!`);
        window.location.href = 'home.html'; // Redirect to the dashboard
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();

    // Profile Event Listeners
    if (elements.profile.pictureForm) {
        elements.profile.pictureForm.addEventListener('submit', saveProfile);
    }

    // Greeting Event Listener
    window.addEventListener('load', () => {
        setGreeting();
        loadProfile();
    
        ; 
    });
    loadUserData();
    // Theme Toggle Event Listener

    // Login and Signup Event Listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    const signUpForm = document.getElementById('signup-form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', signUpUser);
    }

    // Logout Button Event Listener
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});
// JavaScript for toggling the sidebar
document.getElementById('burger-menu').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  });
  
