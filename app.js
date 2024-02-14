const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragmento = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', fetchData);
cards.addEventListener('click', addCarrito);
items.addEventListener('click', btnAccion);

async function fetchData() {
  try {
    const res = await fetch('api.json');
    const data = await res.json();
    mostrarProductos(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function mostrarProductos(data) {
  data.forEach(producto => {
    const { id, title, precio, thumbnailURL } = producto;
    const clone = templateCard.cloneNode(true);
    clone.querySelector('h5').textContent = title;
    clone.querySelector('p').textContent = precio;
    clone.querySelector('img').setAttribute('src', thumbnailURL);
    clone.querySelector('.btn-dark').dataset.id = id;
    fragmento.appendChild(clone);
  });
  cards.appendChild(fragmento);
}

function addCarrito(e) {
  if (e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
}

function setCarrito(objeto) {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
  };

  carrito[producto.id] = carrito[producto.id] || { ...producto, cantidad: 0 };
  carrito[producto.id].cantidad++;
  mostrarCarrito();
}

function mostrarCarrito() {
  items.innerHTML = '';
  const totalPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

  if (Object.keys(carrito).length === 0) {
    items.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar</th>`;
  } else {
    Object.values(carrito).forEach(producto => {
      const cloneProducto = templateCarrito.cloneNode(true);
      cloneProducto.querySelector('th').textContent = producto.id;
      cloneProducto.querySelectorAll('td')[0].textContent = producto.title;
      cloneProducto.querySelectorAll('td')[1].textContent = producto.cantidad;
      cloneProducto.querySelector('.btn-info').dataset.id = producto.id;
      cloneProducto.querySelector('.btn-danger').dataset.id = producto.id;
      cloneProducto.querySelector('span').textContent = producto.cantidad * producto.precio;
      fragmento.appendChild(cloneProducto);
    });
    items.appendChild(fragmento);
  }

  mostrarFooter(totalPrecio);
}

function mostrarFooter(totalPrecio) {
  footer.innerHTML = '';
  const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);

  if (nCantidad === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar</th>`;
  } else {
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelectorAll('span')[0].textContent = totalPrecio;
    const clone = templateFooter.cloneNode(true);
    fragmento.appendChild(clone);
    footer.appendChild(fragmento);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
      carrito = {};
      mostrarCarrito();
    });
  }
}

function btnAccion(e) {
  if (e.target.classList.contains('btn-info')) {
    carrito[e.target.dataset.id].cantidad++;
  }

  if (e.target.classList.contains('btn-danger')) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;

    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
  }

  mostrarCarrito();
}

