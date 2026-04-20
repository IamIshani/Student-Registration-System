const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentId = document.getElementById("studentId");
const emailId = document.getElementById("emailId");
const contactNo = document.getElementById("contactNo");
const submitBtn = document.getElementById("submitBtn");
const studentTableBody = document.getElementById("studentTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const tableWrapper = document.getElementById("tableWrapper");

const nameError = document.getElementById("nameError");
const idError = document.getElementById("idError");
const emailError = document.getElementById("emailError");
const contactError = document.getElementById("contactError");

let editIndex = null;

let students = JSON.parse(localStorage.getItem("students")) || [];

renderStudents();

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const studentData = {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    email: emailId.value.trim(),
    contact: contactNo.value.trim()
  };

  if (editIndex === null) {
    students.push(studentData);
  } else {
    students[editIndex] = studentData;
    editIndex = null;
    submitBtn.textContent = "Add Student";
  }

  saveToLocalStorage();
  renderStudents();
  studentForm.reset();
});

function validateForm() {
  let isValid = true;

  clearErrors();

  const nameValue = studentName.value.trim();
  const idValue = studentId.value.trim();
  const emailValue = emailId.value.trim();
  const contactValue = contactNo.value.trim();

  if (!nameValue && !idValue && !emailValue && !contactValue) {
    nameError.textContent = "Please fill out the form.";
    return false;
  }

  const namePattern = /^[A-Za-z ]+$/;
  if (nameValue === "") {
    nameError.textContent = "Student name is required.";
    isValid = false;
  } else if (!namePattern.test(nameValue)) {
    nameError.textContent = "Name should contain only letters and spaces.";
    isValid = false;
  }

  const idPattern = /^[0-9]+$/;
  if (idValue === "") {
    idError.textContent = "Student ID is required.";
    isValid = false;
  } else if (!idPattern.test(idValue)) {
    idError.textContent = "Student ID should contain only numbers.";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailValue === "") {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!emailPattern.test(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  const contactPattern = /^[0-9]+$/;
  if (contactValue === "") {
    contactError.textContent = "Contact number is required.";
    isValid = false;
  } else if (!contactPattern.test(contactValue)) {
    contactError.textContent = "Contact number should contain only numbers.";
    isValid = false;
  } else if (contactValue.length < 10) {
    contactError.textContent = "Contact number must be at least 10 digits.";
    isValid = false;
  }

  return isValid;
}

function clearErrors() {
  nameError.textContent = "";
  idError.textContent = "";
  emailError.textContent = "";
  contactError.textContent = "";
}

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderStudents() {
  studentTableBody.innerHTML = "";

  if (students.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editStudent(${index})">Edit</button>
      </td>
      <td>
        <button class="action-btn delete-btn" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    studentTableBody.appendChild(row);
  });

  toggleScrollbar();
}

function editStudent(index) {
  const student = students[index];

  studentName.value = student.name;
  studentId.value = student.id;
  emailId.value = student.email;
  contactNo.value = student.contact;

  editIndex = index;
  submitBtn.textContent = "Update Student";
  clearErrors();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteStudent(index) {
  const confirmDelete = confirm("Are you sure you want to delete this student record?");
  if (confirmDelete) {
    students.splice(index, 1);
    saveToLocalStorage();
    renderStudents();

    if (editIndex === index) {
      studentForm.reset();
      editIndex = null;
      submitBtn.textContent = "Add Student";
    }
  }
}

function toggleScrollbar() {
  if (students.length > 5) {
    tableWrapper.classList.add("scroll-active");
  } else {
    tableWrapper.classList.remove("scroll-active");
  }
}

studentName.addEventListener("input", function () {
  this.value = this.value.replace(/[^A-Za-z ]/g, "");
});

studentId.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

contactNo.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});