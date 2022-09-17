let elForm = document.querySelector(".header__form");
let elInput = document.querySelector(".search__input");
let select = document.querySelector(".header__select");
let list = document.querySelector(".hero__list");
let template = document.querySelector("#template").content;
let elBookList = document.querySelector(".book__list");
let elPageList = document.querySelector(".page-list");
let pageNumbers = document.querySelector(".page__numbers");
let elSpinner = document.querySelector(".spinner_box");

let page = 1;
let titleValue = "hulk";
let type = "movie";

let bookArr = JSON.parse(localStorage.getItem("movies")) || [];

const moviesData = async (movie) => {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=b5d53f4c&s=${movie}&page=${page}&type=${type}`)

    const data = await response.json();
    renderItem(data.Search);

    pageNumbers.innerHTML = "";
    for(i = 1 ; i <= 10 ; i++) {
      let pageNumber = document.createElement("li");
      pageNumber.setAttribute("class", "text-danger h5 px-2 mx-1 page-link page__number")
      pageNumber.textContent = i;
      pageNumber.dataset.filmId = i;
      pageNumbers.appendChild(pageNumber);
    }

  } catch(err) {
    console.log(err.message);
  } finally {
    elSpinner.classList.add("d-none");
  }
} 

const movieData = async (moviId) => {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=b5d53f4c&i=${moviId}`)

    const data = await response.json();
    clickBook(data);
  } catch(err) {
    console.log(err.message);
  }
} 

moviesData('hulk')

function objItem(obj) {
  let elItem = template.cloneNode(true);
  elItem.querySelector(".js-img").src = obj.Poster;
  elItem.querySelector(".js-title").textContent = `${obj.Title.slice(0,15)}...`;
  elItem.querySelector(".js-year").textContent = `Year: ${obj.Year}`;
  elItem.querySelector(".js-text").textContent = `Type: ${obj.Type}`;
  elItem.querySelector(".js-btn").dataset.imdId = obj.imdbID;
  elItem.querySelector(".book__btn").dataset.imdId = obj.imdbID;
  return elItem
}

list.addEventListener("click", (evt) => {
  if (evt.target.matches(".book__btn")) {
    let bookImd = evt.target.dataset.imdId;
    movieData(bookImd);
  }
})

function clickBook (movie) {
  bookArr.push(movie);
  localStorage.setItem("movies", JSON.stringify(bookArr));
  renderBook(bookArr);
}

function renderBook(arr) {
  elBookList.innerHTML = "";

  arr.forEach((bookMovie,index) => {
    let elItemBook = document.createElement("li");
    elItemBook.setAttribute("class","mb-3");
    elItemBook.innerHTML = ` <p class="d-inline-block text-primary h5">${index + 1} ${bookMovie.Title}</p> <button id = "${bookMovie.imdbID}" class="text-green db btn btn-danger ms-2">delete</button>`

    elBookList.appendChild(elItemBook);
  })
}

renderBook(bookArr)

function deletItem(id) {
  elBookList.addEventListener("click", (evt) => {
    if(evt.target.matches(".db")) {
      let id = evt.target.id;
      let findDeletMovie = bookArr.findIndex(movie => movie.imdbID == id);
      bookArr.splice(findDeletMovie,1);
      renderBook(bookArr);;
      localStorage.setItem("movies", JSON.stringify(bookArr));
    }
  })
}

deletItem()


function renderItem (movies) {
  let box = document.createDocumentFragment();
  list.innerHTML = ""; 
  
  modalOppen(movies)
  movies.forEach(movie => {
    box.appendChild(objItem(movie))
  })
  
  list.appendChild(box);
}


function modalOppen (arr) {
  list.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-btn")){
      let btnImdb = evt.target.dataset.imdId;
      let findMove = arr.find(movie => movie.imdbID == btnImdb)

      let ModalTitle = document.querySelector(".modal-title");
      ModalTitle.textContent = findMove.Title;
      
      let ModalImg = document.querySelector(".modal_img");
      ModalImg.src = findMove.Poster
      
      let ModalYear = document.querySelector(".modal__text");
      ModalYear.textContent = `Year: ${findMove.Year}`

      let ModalType = document.querySelector(".modal__type");
      ModalType.textContent = `Type: ${findMove.Type}`

      let ModalImdb = document.querySelector(".modal__imdb");
      ModalImdb.textContent = `ImdbID: ${findMove.imdbID}`
    }
  })
}


elForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  list.innerHTML = ""
  elSpinner.classList.remove("d-none");

  titleValue = elInput.value.toLowerCase().trim();
  type = select.value 
  
  moviesData(titleValue);
})

elPageList.addEventListener("click", function(evt) {
  if(evt.target.matches(".page__next")){
    if(elInput.value == "") {
      titleValue = "hulk"
    }

    list.innerHTML = ""
    elSpinner.classList.remove("d-none");

    list.innerHTML = ""
    page++
    moviesData(titleValue)
  }
  if(evt.target.matches(".page__prev")) {
    if
    (page > 1) {

      list.innerHTML = ""
      elSpinner.classList.remove("d-none");

      list.innerHTML = ""
      page--
      moviesData(titleValue)
    }
  }
  if(evt.target.matches(".page__number")) {

    list.innerHTML = ""
    elSpinner.classList.remove("d-none");

    
    const clickId = evt.target.dataset.filmId
    page = clickId
    moviesData(titleValue)
  }
})