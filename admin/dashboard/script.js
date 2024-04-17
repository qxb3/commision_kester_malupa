const nav = document.getElementById('nav')
const title = document.getElementById('title')
const content = document.getElementById('content')
const username = document.getElementById('username')

document.addEventListener('DOMContentLoaded', () => {
  const authLocal = localStorage.getItem('authenticated')
  if (!authLocal) {
    return window.location.href = '/admin/login'
  }

  const authenticated = JSON.parse(authLocal)
  username.innerText = authenticated.username

  start()
})

function start() {
  let orders = JSON.parse(localStorage.getItem('orders') ?? '[]')

  // Load mock data
  if (orders.length <= 0) {
    localStorage.setItem('orders', JSON.stringify([
      {
        code: "X3k9Y",
        name: "John Doe",
        dateReceived: "04/15/2024",
        item: "3 T-Shirts",
        branch: "Quezon City - Batasan",
        price: 1200,
        transportation: "Air",
        status: "pending"
      },
      {
        code: "pR7t2",
        name: "Jane Smith",
        dateReceived: "04/16/2024",
        item: "1 Laptop",
        branch: "Sta. Mesa - Manila",
        price: 35000,
        transportation: "Sea",
        status: "pending"
      },
      {
        code: "Q6hTf",
        name: "Michael Johnson",
        dateReceived: "04/14/2024",
        item: "2 Books",
        branch: "Basco - Batanes",
        price: 1500,
        transportation: "Air",
        status: "pending"
      },
      {
        code: "L8sP4",
        name: "Emily Davis",
        dateReceived: "04/13/2024",
        item: "5 Phones",
        branch: "Quezon City - Batasan",
        price: 50000,
        transportation: "Air",
        status: "pending"
      },
      {
        code: "m2E9z",
        name: "David Martinez",
        dateReceived: "04/17/2024",
        item: "1 Tablet",
        branch: "Sta. Mesa - Manila",
        price: 8000,
        transportation: "Sea",
        status: "pending"
      }
    ]))

    window.location.href = '/admin/dashboard'
  }

  setDashboard()

  function setDashboard() {
    const pendingOrders = orders.filter((order) => order.status === 'pending').length
    const arrivedOrders = orders.filter((order) => order.status === 'arrived').length

    title.innerText = 'Dashboard'
    content.innerHTML =  `
      <div class="dashboard">
        <h1 class="stat pending-orders">
          <span class="icon">
            <ion-icon name="build"></ion-icon>
          </span>
          <span>Pending Orders: ${pendingOrders}</span>
        </h1>

        <h1 class="stat orders">
          <span class="icon">
            <ion-icon name="checkmark"></ion-icon>
          </span>
          <span>Orders: ${arrivedOrders}</span>
        </h1>
      </div>
    `
  }

  function setInventory() {
    function populate(transport, branch) {
      const filteredOrders = orders.filter((order) => (transport === 'all' ? true : order.transportation === transport) && (branch === 'all' ? true : order.branch === branch))

      return filteredOrders.map((order) => `
        <tr>
          <th>${order.code}</th>
          <th>${order.name}</th>
          <th>${order.dateReceived}</th>
          <th>${order.item}</th>
          <th>${order.branch}</th>
          <th>${order.price}</th>
          <th>${order.transportation}</th>
        </tr>
      `).join('')
    }

    title.innerText = 'Orders'
    content.innerHTML =  `
      <div class="inventory">
        <div class="selects">
          <div>
            <div>
              <h4>Way of transportation:</h4>

              <select id="transportSelect">
                <option value="all">All</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
              </select>
            </div>

            <br><br>

            <div>
              <h4>Branch:</h4>

              <select id="branchSelect">
                <option value="all">All</option>
                <option value="Quezon City - Batasan">Quezon City - Batasan</option>
                <option value="Sta. Mesa - Manila">Sta. Mesa - Manila</option>
                <option value="Basco - Batanes">Basco - Batanes</option>
              </select>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Date Received</th>
              <th>Item</th>
              <th>Branch</th>
              <th>Price</th>
              <th>Transportation</th>
            </tr>
          </thead>

          <tbody id="orders-table">
            ${populate('all', 'all')}
          </tbody>
        </table>
      </div>
    `

    const ordersTable = document.getElementById('orders-table')
    const transportSelect = document.getElementById('transportSelect')
    const branchSelect = document.getElementById('branchSelect')

    transportSelect.addEventListener('change', (e) => ordersTable.innerHTML = populate(e.target.value, branchSelect.value))
    branchSelect.addEventListener('change', (e) => ordersTable.innerHTML = populate(transportSelect.value, e.target.value))
  }

  function setPackageStat() {
    function name(n) {
      return n.replace(/ /g, '')
    }

    function populate() {
      return orders.map((order) => `
        <tr>
          <th>${order.name}</th>
          <th>
          <select id="stat-select-${name(order.name)}">
          <option value="${name(order.name)}:pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="${name(order.name)}:on_transit" ${order.status === 'on_transit' ? 'selected' : ''}>On Transit</option>
          <option value="${name(order.name)}:arrived" ${order.status === 'arrived' ? 'selected' : ''}>Arrived</option>
          </select>
          </th>
        </tr>
      `).join(' ')
    }

    title.innerText = 'Set Status'
    content.innerHTML = `
      <div class="package-stat">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody id="stat-table">
            ${populate()}
          </tbody>
        </table>
      </div>
    `

    orders.forEach((order) => {
      document.getElementById(`stat-select-${name(order.name)}`).addEventListener('change', (e) => {
        const [nameId, status] = e.target.value.split(':')

        orders = orders.map((order) => {
          if (name(order.name) === nameId) order.status = status

          return order
        })

        localStorage.setItem('orders', JSON.stringify(orders))
      })
    })
  }

  function navState(page) {
    nav.classList.toggle('active')

    document
      .querySelectorAll('.pages .page')
      .forEach((page) => {
        page.classList.remove('active')
      })

    document.querySelector(`button.${page}`).classList.add('active')
  }

  clickListener('toggle-nav-button', () => nav.classList.toggle('active'))
  clickListener('dashboard-btn', () => { setDashboard(); navState('dashboard'); })
  clickListener('inventory-btn', () => { setInventory(); navState('inventory'); })
  clickListener('package-stat-btn', () => { setPackageStat(); navState('package-stat'); })
  clickListener('logout-btn', () => {
    localStorage.removeItem('authenticated')
    window.location.href = '/admin/login'
  })

  function clickListener(id, callbackFn) {
    document.getElementById(id).addEventListener('click', callbackFn)
  }
}
