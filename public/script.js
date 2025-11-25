const API_URL = '/api/students'
const tableBody = document.getElementById('studentTable')
const form = document.getElementById('studentForm')
const submitBtn = document.getElementById('submitBtn')
const idInput = document.getElementById('studentId')

//Ambil semua data mahasiswa
async function fetchStudents() {
  const res = await fetch(API_URL)
  const students = await res.json()
  renderTable(students)
}

//Render tabel mahasiswa
function renderTable(students) {
  tableBody.innerHTML = ''
  students.forEach(s => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td class="border p-2 text-center">${s.id}</td>
      <td class="border p-2">${s.name}</td>
      <td class="border p-2">${s.major}</td>
      <td class="border p-2 text-center">${s.gpa}</td>
      <td class="border p-2 text-center space-x-2">
        <button onclick="editStudent(${s.id}, '${s.name}', '${s.major}', ${s.gpa})" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
        <button onclick="deleteStudent(${s.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
      </td>
    `
    tableBody.appendChild(row)
  })
}

//Tambah/Update mahasiswa
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const id = idInput.value
  const name = document.getElementById('name').value
  const major = document.getElementById('major').value
  const gpa = parseFloat(document.getElementById('gpa').value)

  // Jika ada ID --> update
  if (id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, major, gpa })
    })

    if (res.ok) {
      alert('Student updated!')
      resetForm()
      fetchStudents()
    } else {
      alert('Failed to update student')
    }

  } else {
    //insert
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, major, gpa })
    })

    if (res.ok) {
      alert('Student added!')
      resetForm()
      fetchStudents()
    } else {
      alert('Failed to add student')
    }
  }
})

//edit
function editStudent(id, name, major, gpa) {
  idInput.value = id
  document.getElementById('name').value = name
  document.getElementById('major').value = major
  document.getElementById('gpa').value = gpa
  submitBtn.textContent = 'Update Student'
  submitBtn.classList.remove('bg-blue-600')
  submitBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600')
}

//Reset form ke mode insert
function resetForm() {
  idInput.value = ''
  form.reset()
  submitBtn.textContent = 'Add Student'
  submitBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600')
  submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700')
}

//delete
async function deleteStudent(id) {
  if (confirm('Delete this student?')) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (res.ok) fetchStudents()
  }
}

//Saat pertama kali dijalankan
fetchStudents()