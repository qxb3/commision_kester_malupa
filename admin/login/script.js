const err = document.getElementById('err')

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault()

  const admins = JSON.parse(localStorage.getItem('admins') ?? '[]')

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const admin = admins.find((adm) => adm.username === username && adm.password === password)
  if (!admin) {
    err.style.display = 'block'
    err.innerText = 'Invalid username or password'

    return
  }

  localStorage.setItem('authenticated', JSON.stringify(admin))

  window.location.href = '/admin/dashboard'
})
