
    const classesList = document.getElementById('classes-list');
    const addClassBtn = document.getElementById('add-class-btn');
    const deleteAllClassesBtn = document.getElementById('delete-all-classes-btn');
    const classesFormModal = document.getElementById('classes-form-modal');
    const classesForm = document.getElementById('classes-form');
    const courseNoInput = document.getElementById('course-no');
    const descriptionInput = document.getElementById('description');
    const scheduleStartInput = document.getElementById('schedule-start');
    const scheduleEndInput = document.getElementById('schedule-end');
    const teacherInput = document.getElementById('teacher');
    const closeClassesModalBtn = document.getElementById('close-classes-modal');
    const classesFormSubmitBtn = document.getElementById('classes-form-submit-btn');
    const classesNoData = document.getElementById('classes-no-data');

    // Retrieve data from localStorage
    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    let editingClassIndex = null; // Variable to track which class is being edited

    // Render classes in the table
    function renderClasses() {
      classesList.innerHTML = ''; // Clear existing rows
      if (classes.length === 0) {
        classesNoData.style.display = 'block';
      } else {
        classesNoData.style.display = 'none';
        classes.forEach((cls, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${cls.courseNo}</td>
            <td>${cls.description}</td>
            <td>${cls.scheduleStart}</td>
            <td>${cls.scheduleEnd}</td>
            <td>${cls.teacher}</td>
            <td>
              <button onclick="editClass(${index})">Edit</button>
              <button onclick="deleteClass(${index})">Delete</button>
            </td>
          `;
          classesList.appendChild(row);
        });
      }
    }

    // Save classes to localStorage
    function saveClasses() {
      localStorage.setItem('classes', JSON.stringify(classes));
    }

    // Open classes form modal
    function openClassesFormModal() {
      classesFormModal.style.display = 'flex';
    }

    // Close classes form modal
    function closeClassesFormModal() {
      classesFormModal.style.display = 'none';
      classesForm.reset();
      editingClassIndex = null; // Reset when closing
      classesFormSubmitBtn.textContent = 'Add Class'; // Reset button text
      document.getElementById('classes-form-title').textContent = 'Add New Class'; // Reset title
    }

    // Add or edit class event listener
    classesForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const courseNo = courseNoInput.value;
      const description = descriptionInput.value;
      const scheduleStart = scheduleStartInput.value;
      const scheduleEnd = scheduleEndInput.value;
      const teacher = teacherInput.value;

      if (editingClassIndex !== null) {
        // Editing an existing class
        classes[editingClassIndex] = { courseNo, description, scheduleStart, scheduleEnd, teacher };
        editingClassIndex = null; // Reset after editing
        classesFormSubmitBtn.textContent = 'Add Class'; // Change button text back
        document.getElementById('classes-form-title').textContent = 'Add New Class'; // Reset title
      } else {
        // Add new class
        if (classes.some(cls => cls.courseNo === courseNo)) {
          alert('Class with this Course No already exists.');
          return;
        }
        classes.push({ courseNo, description, scheduleStart, scheduleEnd, teacher });
      }

      saveClasses();
      renderClasses();
      closeClassesFormModal();
    });

    // Edit class function
    function editClass(index) {
      const cls = classes[index];
      courseNoInput.value = cls.courseNo;
      descriptionInput.value = cls.description;
      scheduleStartInput.value = cls.scheduleStart;
      scheduleEndInput.value = cls.scheduleEnd;
      teacherInput.value = cls.teacher;

      editingClassIndex = index; // Set index to track editing
      openClassesFormModal();
      classesFormSubmitBtn.textContent = 'Save Changes'; // Change button text
      document.getElementById('classes-form-title').textContent = 'Edit Class'; // Change title
    }

    // Delete class function
    function deleteClass(index) {
      if (confirm('Are you sure you want to delete this class?')) {
        classes.splice(index, 1);
        saveClasses();
        renderClasses();
      }
    }

    // Delete all classes event listener
    deleteAllClassesBtn.addEventListener('click', () => {
      if (classes.length === 0) {
        alert('Nothing to delete.');
      } else {
        if (confirm('Are you sure you want to delete all classes?')) {
          classes = [];
          saveClasses();
          renderClasses();
        }
      }
    });

    // Modal controls
    addClassBtn.addEventListener('click', () => {
      classesForm.reset();
      editingClassIndex = null; // Reset when opening for adding new
      classesFormSubmitBtn.textContent = 'Add Class'; // Set button text
      document.getElementById('classes-form-title').textContent = 'Add New Class'; // Set title
      openClassesFormModal();
    });
    closeClassesModalBtn.addEventListener('click', closeClassesFormModal);

    // Initial render on page load
    window.onload = renderClasses;
