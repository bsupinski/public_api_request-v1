const body = document.querySelector("body");
const searchContainer = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
const search = document.getElementById("search-input");

const userAPI = `https://randomuser.me/api/?results=12`;

const usersState = [];

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

function modalHTML(person) {
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
  modalImg.setAttribute("src", `${imgSizeCheck(person.picture)}`);
  modalImg.setAttribute("alt", `${person.name.first} ${person.name.last}`);

  const modalName = document.createElement("div");
  modalName.classList.add("modal-name", "cap");
  modalName.setAttribute("id", "name");
  modalName.innerText = `${person.name.first} ${person.name.last}`;

  const modalEmail = document.createElement("div");
  modalEmail.classList.add("modal-text", "modal-email");
  modalEmail.innerText = `${person.email}`;

  const modalCity = document.createElement("div");
  modalCity.classList.add("modal-text", "modal-city", "cap");
  modalCity.innerText = `${person.location.city}`;

  const modalPhone = document.createElement("div");
  modalPhone.classList.add("modal-text", "modal-phone");
  modalPhone.innerText = `${person.phone}`;

  const modalAddress = document.createElement("div");
  modalAddress.classList.add("modal-text", "modal-address");
  modalAddress.innerText = `${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state}`;

  const modalBirthday = document.createElement("div");
  modalBirthday.classList.add("modal-text", "modal-birthday");
  modalBirthday.innerText = `${formatBday(person.dob.date)}`;

  const btnContainer = document.createElement("div");
  btnContainer.setAttribute("type", "button");
  btnContainer.classList.add("modal-btn-container");

  const prevBtn = document.createElement("button");
  prevBtn.setAttribute("type", "button");
  prevBtn.setAttribute("id", "modal-prev");
  prevBtn.classList.add("modal-prev", "btn");
  prevBtn.innerText = "Prev";

  const nextBtn = document.createElement("button");
  nextBtn.setAttribute("type", "button");
  nextBtn.setAttribute("id", "modal-next");
  nextBtn.classList.add("modal-next", "btn");
  nextBtn.innerText = "Next";

  btnContainer.append(prevBtn, nextBtn);

  closeButton.append(strongText);
  modalInfoContainer.append(
    modalImg,
    modalName,
    modalEmail,
    modalPhone,
    modalCity,
    modalAddress,
    modalBirthday
  );

  modal.append(closeButton, modalInfoContainer, btnContainer);
  modalContainer.append(modal);
  body.append(modalContainer);
}

function modalCardHTML(person) {
  const personImg = document.querySelector(".modal-img");
  const personName = document.querySelector(".modal-name");
  const personEmail = document.querySelector(".modal-email");
  const personCity = document.querySelector(".modal-city");
  const personPhone = document.querySelector(".modal-phone");
  const personAddress = document.querySelector(".modal-address");
  const personBirthday = document.querySelector(".modal-birthday");

  personImg.src = `${imgSizeCheck(person.picture)}`;
  personImg.alt = `${person.name.first} ${person.name.last}`;
  personName.innerText = `${person.name.first} ${person.name.last}`;
  personEmail.innerText = `${person.email}`;
  personCity.innerText = `${person.location.city}`;
  personPhone.innerText = `${person.phone}`;
  personAddress.innerText = `${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state}`;
  personBirthday.innerText = `${formatBday(person.dob.date)}`;
}

// Helpers
function formatBday(timeStamp) {
  const justTheDate = timeStamp.split("T")[0].split("-");
  const bday = `${justTheDate[1].padStart(2, "0")}/${justTheDate[2].padStart(
    2,
    "0"
  )}/${justTheDate[0].padStart(2, "0")}`;
  return bday;
}

function imgSizeCheck(img) {
  return `${img.large} ` ? `${img.large} ` : `${img.small}`;
}

// Button functions
function nextBtn(currentPerson) {
  const nextBtn = document.querySelector(".modal-next");
  nextBtn.addEventListener("click", () => {
    const currentIndex = usersState.indexOf(currentPerson);
    if (currentIndex >= usersState.length - 1) {
      currentPerson = usersState[0];
      modalCardHTML(currentPerson);
    } else {
      currentPerson = usersState[currentIndex + 1];
      modalCardHTML(currentPerson);
    }
  });
}

function prevBtn(currentPerson) {
  const prevBtn = document.querySelector(".modal-prev");
  prevBtn.addEventListener("click", () => {
    const currentIndex = usersState.indexOf(currentPerson);
    if (currentIndex === 0) {
      currentPerson = usersState[usersState.length - 1];
      modalCardHTML(currentPerson);
    } else {
      currentPerson = usersState[currentIndex - 1];
      modalCardHTML(currentPerson);
    }
  });
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
  usersState.map((person) => {
    cardHTML(person);
  });
}

//Event Listeners
function closeButton() {
  const close = document.getElementById("modal-close-btn");
  const modal = document.querySelector(".modal-container");
  close.addEventListener("click", (e) => {
    modal.remove();
  });
}

gallery.addEventListener("click", (e) => {
  if (!e.target.classList.contains("gallery")) {
    let currentPerson = e.target
      .closest(".card")
      .querySelector(".card-info-container")
      .querySelector(".card-name").innerText;
    usersState.forEach((bday) => {});
    usersState.forEach((person) => {
      if (`${person.name.first} ${person.name.last}` === currentPerson) {
        currentPerson = person;
      }
    });

    modalHTML(currentPerson);
    closeButton();
    nextBtn(currentPerson);
    prevBtn(currentPerson);
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

// Load cards on page load
createUserCards();
