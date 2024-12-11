const url = 'https://striveschool-api.herokuapp.com/books';
const contentBox = document.getElementById('contentBox');
let myList = [];
let btnsAdd = [];
let btnsRemove = [];

document.addEventListener('load', init());

function init() {
  getList();
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

function add(asin) {
  console.log(asin);
}

function remove(myAsin) {
  let index;
  for (let i = 0; i < myList.length; i++) {
    if (myList[i].asin === myAsin) {
      index = i;
      break;
    }
  }

  myList.splice(index, 1);
  loadList();
}
