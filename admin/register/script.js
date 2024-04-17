const err = document.getElementById('err')

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const surname = document.getElementById('surname').value
  const phone = document.getElementById('phone').value
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirm-password').value

  if (password !== confirmPassword) {
    err.innerText = 'Confirm password does not match'
    err.style.display = 'block'

    return
  }

  const newAdmin = { name, surname, phone, username, password }
  const registeredAdmins = JSON.parse(localStorage.getItem('admins') ?? '[]')
  registeredAdmins.push(newAdmin)

  localStorage.setItem('admins', JSON.stringify(registeredAdmins))
  localStorage.setItem('authenticated', JSON.stringify(newAdmin))

  window.location.href = '/admin/dashboard'
})

function clickListener(id, callbackFn) {
  document.getElementById(id).addEventListener('click', callbackFn)
}
