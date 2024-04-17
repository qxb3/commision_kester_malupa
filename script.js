const content = document.getElementById('content')

setHome()
navState('home')

function setHome() {
  content.innerHTML = `
    <div class="home">
      <h1>Home</h1>
    </div>
  `
}

function setTrack() {
  content.innerHTML = `
    <div class="track">
      <div>
        <h2>Track your package</h2>
        <div id="err" style="display: none; margin-bottom: 1rem; background-color: red; padding: 1rem; color: white;"></div>

        <form class="form" id="form">
          <input id="tracking-id" type="text" placeholder="Enter tracking #" required />
          <select id="branch-select">
            <option value="Quezon City - Batasan">Quezon City - Batasan</option>
            <option value="Sta. Mesa - Manila">Sta. Mesa - Manila</option>
            <option value="Basco - Batanes">Basco - Batanes</option>
          </select>

          <button id="submit" type="submit">
            <span class="icon">
              <ion-icon name="search"></ion-icon>
            </span>
            <span>Track</span>
          </button>
        </form>

        <div id="result"></div>
      </div>
    </div>
  `

  document.querySelector('.track #form').addEventListener('submit', (e) => {
    e.preventDefault()

    const err = document.getElementById('err')
    const result = document.getElementById('result')

    const trackingId = document.getElementById('tracking-id').value
    const branch = document.getElementById('branch-select').value

    const orders = JSON.parse(localStorage.getItem('orders') ?? '[]')
    const parcel = orders.find((order) => order.code === trackingId && order.branch === branch)
    if (!parcel) {
      result.style.display = 'none'
      err.innerText = 'Cannot find that parcel'
      err.style.display = 'block'

      return
    }

    err.innerText = ''
    err.style.display = 'none'

    result.style.display = 'block'
    result.innerHTML = `
      <h1 style="color: green;">Found!<h1>
      <br>
      <h2>Name: ${parcel.name}</h2>
      <h2>Item: ${parcel.item}</h2>
      <h2>Status: ${parcel.status}</h2>
    `
  })
}

function navState(page) {
  document
    .querySelectorAll('nav button')
    .forEach((button) => {
      button.classList.remove('active')
    })

  document.querySelector(`nav button.${page}`).classList.add('active')
}

clickListener('home-btn', () => { setHome(); navState('home'); })
clickListener('track-btn', () => { setTrack(); navState('track'); })

function clickListener(id, callbackFn) {
  document.getElementById(id).addEventListener('click', callbackFn)
}
