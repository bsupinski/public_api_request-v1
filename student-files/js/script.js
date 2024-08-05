const body = document.querySelector("body");
const searchContainer = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
const search = document.getElementById("search-input");

const userAPI = `https://randomuser.me/api/?results=12`;

const usersState = [];

function modalHTML() {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeButton = document.createElement("button");
  closeButton.classList.add("modal-close-btn");
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("id", "modal-close-btn");

  const strongText = document.createElement("strong");
  strongText.innerText = "X";

  const modalInfoContainer = document.createElement("div");
  modalInfoContainer.classList.add("modal-info-container");

  const modalImg = document.createElement("img");
  modalImg.classList.add("modal-img");
  modalImg.setAttribute("src", `https://placehold.it/125x125`);
  modalImg.setAttribute("alt", `temp`);

  const modalName = document.createElement("div");
  modalName.classList.add("modal-name", "cap");
  modalName.setAttribute("id", "name");
  modalName.innerText = `Temp`;

  const modalEmail = document.createElement("div");
  modalEmail.classList.add("modal-text");
  modalEmail.innerText = `Temp`;

  const modalCity = document.createElement("div");
  modalCity.classList.add("modal-text", "cap");
  modalCity.innerText = `Temp`;

  const modalPhone = document.createElement("div");
  modalPhone.classList.add("modal-text");
  modalPhone.innerText = `Temp`;

  const modalAddress = document.createElement("div");
  modalAddress.classList.add("modal-text");
  modalAddress.innerText = `Temp`;

  const modalBirthday = document.createElement("div");
  modalBirthday.classList.add("modal-text");
  modalBirthday.innerText = `Temp`;

  closeButton.append(strongText);
  modalInfoContainer.append(
    modalImg,
    modalName,
    modalEmail,
    modalCity,
    modalAddress,
    modalBirthday
  );

  modal.append(closeButton, modalInfoContainer);
  modalContainer.append(modal);
  body.append(modalContainer);
}

// Create HTML
function cardHTML(person) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("card-img-container");
  const profileImg = document.createElement("img");
  profileImg.classList.add("card-img");
  profileImg.setAttribute("src", person.picture.medium);
  profileImg.setAttribute(
    "alt",
    `An image of ${person.name.first} ${person.name.last}`
  );

  const cardInfoContainer = document.createElement("div");
  cardInfoContainer.classList.add("card-info-container");

  const personName = document.createElement("h3");
  personName.setAttribute("id", "name");
  personName.classList.add("card-name", "cap");
  personName.innerText = `${person.name.first} ${person.name.last}`;

  const personEmail = document.createElement("div");
  personEmail.classList.add("card-text");
  personEmail.innerText = `${person.email}`;

  const personLoc = document.createElement("div");
  personLoc.classList.add("card-text", "cap");
  personLoc.innerText = `${person.location.city}, ${person.location.state}`;

  imgContainer.append(profileImg);
  cardInfoContainer.append(personName, personEmail, personLoc);

  cardDiv.append(imgContainer, cardInfoContainer);
  gallery.append(cardDiv);
}

function addHTML(html, parent) {
  parent.innerHTML = html;
}

// Set up API call
async function getUsers(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();

    usersState.push(...data.results);
  } catch (error) {
    console.log(error);
  }
}

// Create User cards
async function createUserCards() {
  await getUsers(userAPI);
  gallery.innerHTML = "";
  console.log(usersState[0]);
  usersState.map((person) => {
    cardHTML(person);
  });
}

//Event Listeners
gallery.addEventListener("click", (e) => {
  if (!e.target.classList.contains("gallery")) {
    modalHTML();
  }
});

// Search by peoples names
search.addEventListener("input", (e) => {
  const peopleNames = document.querySelectorAll(".card-name");
  peopleNames.forEach((person) => {
    if (!person.innerText.toLowerCase().includes(search.value.toLowerCase()))
      person.parentNode.parentNode.style.display = "none";
    else person.parentNode.parentNode.style.display = "flex";
  });
});
createUserCards();
