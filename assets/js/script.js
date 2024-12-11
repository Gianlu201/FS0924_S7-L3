const url = 'https://striveschool-api.herokuapp.com/books';
const contentBox = document.getElementById('contentBox');
const collapseCart = document.getElementById('collapseCart');
const cartCounterArea = document.getElementById('cartCounterArea');
let myList = [];
const myCart = [];
let cartCounter;

document.addEventListener('load', init());

function init() {
  getList();
  checkCart();
}

async function getList() {
  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json; charset=UTF-8',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((element) => {
        myList.push(element);
      });
      loadList();
    })
    .catch((error) => {
      console.log(`Errore nella lettura dei dati, errore: ${error}`);
    });
}

function checkCart() {
  const recoverCart = JSON.parse(localStorage.getItem('myCart'));
  if (recoverCart) {
    for (let i = 0; i < recoverCart.length; i++) {
      myCart.push(recoverCart[i]);
    }
    cartCounter = recoverCart.length;
    loadCart();
  } else {
    cartCounter = 0;
  }
}

function loadList() {
  contentBox.innerHTML = '';
  if (myList.length === 0) {
    const myH2 = document.createElement('h2');
    myH2.innerText('Tutti gli elementi sono stati scartati');
    contentBox.appendChild(myH2);
  } else {
    for (let i = 0; i < myList.length; i++) {
      const myCol = document.createElement('div');
      myCol.classList.add('col-6', 'col-md-4', 'col-lg-3');

      const myCard = document.createElement('div');
      myCard.classList.add('card', 'mb-4');
      myCard.id = myList[i].asin;

      const myImg = document.createElement('img');
      myImg.src = myList[i].img;
      myImg.classList.add('card-img-top');
      myImg.alt = myList[i].title;
      myCard.appendChild(myImg);

      const myDiv = document.createElement('div');
      myDiv.classList.add('card-body');

      const myH5 = document.createElement('h5');
      myH5.classList.add('card-title');
      myH5.innerText = myList[i].title;
      myDiv.appendChild(myH5);

      const mySpanCategory = document.createElement('span');
      mySpanCategory.classList.add(
        'category',
        'bg-dark',
        'text-light',
        'rounded-3',
        'px-2',
        'py-1'
      );
      mySpanCategory.innerText = myList[i].category;
      myDiv.appendChild(mySpanCategory);

      const myPPrice = document.createElement('p');
      myPPrice.classList.add('card-text', 'mt-2');
      myPPrice.innerText = `€${myList[i].price}`;
      myDiv.appendChild(myPPrice);

      const myBtnAdd = document.createElement('button');
      myBtnAdd.classList.add('add', 'btn', 'btn-danger');
      myBtnAdd.innerText = 'Compra ora';
      myBtnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        add(myList[i].asin);
      });
      myDiv.appendChild(myBtnAdd);

      const myBtnRemove = document.createElement('button');
      myBtnRemove.classList.add('remove', 'btn', 'btn-outline-danger', 'ms-3');
      myBtnRemove.innerText = 'Scarta';
      myBtnRemove.addEventListener('click', (e) => {
        e.preventDefault();
        remove(myList[i].asin);
      });
      myDiv.appendChild(myBtnRemove);

      myCard.appendChild(myDiv);
      myCol.appendChild(myCard);
      contentBox.appendChild(myCol);
    }
  }
}

function add(myAsin) {
  cartCounter++;
  for (let i = 0; i < myList.length; i++) {
    if (myList[i].asin === myAsin) {
      myCart.push(myList[i]);
      break;
    }
  }

  loadCart();
}

function remove(myAsin) {
  for (let i = 0; i < myList.length; i++) {
    if (myList[i].asin === myAsin) {
      myList.splice(i, 1);
      break;
    }
  }

  loadList();
}

function loadCart() {
  localStorage.setItem('myCart', JSON.stringify(myCart));
  collapseCart.innerHTML = '';

  const myH4 = document.createElement('h4');
  myH4.innerText = `Totale: €${calculateTotal()}`;
  collapseCart.appendChild(myH4);

  for (let i = 0; i < myCart.length; i++) {
    const myCard = document.createElement('div');
    myCard.classList.add('card', 'mb-3');

    const myRow = document.createElement('div');
    myRow.classList.add('row', 'g-0');

    const myCol1 = document.createElement('div');
    myCol1.classList.add('col-md-4');

    const myImg = document.createElement('img');
    myImg.classList.add('img-fluid', 'rounded-start');
    myImg.src = myCart[i].img;
    myCol1.appendChild(myImg);

    myRow.appendChild(myCol1);

    const myCol2 = document.createElement('div');
    myCol2.classList.add('col-md-8');

    const myDiv = document.createElement('div');

    const myH5 = document.createElement('h5');
    myH5.classList.add('card-title');
    myH5.innerText = myCart[i].title;
    myDiv.appendChild(myH5);

    const myPPrice = document.createElement('p');
    myPPrice.classList.add('card-text');
    myPPrice.innerText = `€${myCart[i].price}`;
    myDiv.appendChild(myPPrice);

    const myBtnRemove = document.createElement('button');
    myBtnRemove.classList.add('btn', 'btn-danger', 'text-white');
    myBtnRemove.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    myBtnRemove.addEventListener('click', (e) => {
      e.preventDefault();
      cartCounter--;
      removeFromCart(myCart[i].asin);
    });
    myDiv.appendChild(myBtnRemove);

    myCol2.appendChild(myDiv);

    myRow.appendChild(myCol2);

    myCard.appendChild(myRow);

    collapseCart.appendChild(myCard);
  }

  updateCartCounter();
}

function removeFromCart(myAsin) {
  for (let i = 0; i < myCart.length; i++) {
    if (myCart[i].asin === myAsin) {
      myCart.splice(i, 1);
      break;
    }
  }

  loadCart();
}

function updateCartCounter() {
  cartCounterArea.innerText = cartCounter;

  if (cartCounter == 0) {
    cartCounterArea.setAttribute('hidden', 'true');
  } else {
    cartCounterArea.removeAttribute('hidden');
    cartCounterArea.innerText = cartCounter;
  }
}

function calculateTotal() {
  let total = 0;
  for (let i = 0; i < myCart.length; i++) {
    total += parseFloat(myCart[i].price);
  }
  return Math.floor(total * 100) / 100;
  // return total;
}
