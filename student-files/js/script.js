const body = document.querySelector("body");
const searchContainer = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
const search = document.getElementById("search-input");

const userAPI = `https://randomuser.me/api/?results=12`;

const usersState = [];

// Create HTML
function cardHTML(person) {
  const cardDiv = createEl("div", ["card"]);
  const imgContainer = createEl("div", ["card-img-container"]);
  const profileImg = createEl("img", ["card-img"], {
    src: `${imgSizeCheck(person.picture)}`,
    alt: `An image of ${person.name.first} ${person.name.last}`,
  });
  const cardInfoContainer = createEl("div", ["card-info-container"]);
  const personName = createEl(
    "h3",
    ["card-name", "cap"],
    { id: "name" },
    `${person.name.first} ${person.name.last}`
  );
  const personEmail = createEl("div", ["card-text"], null, `${person.email}`);
  const personLoc = createEl(
    "div",
    ["card-text", "cap"],
    null,
    `${person.location.city}, ${person.location.state}`
  );

  imgContainer.append(profileImg);
  cardInfoContainer.append(personName, personEmail, personLoc);

  cardDiv.append(imgContainer, cardInfoContainer);
  gallery.append(cardDiv);
}

function modalHTML(person) {
  const modalContainer = createEl("div", ["modal-container"], null, null);
  const modal = createEl("div", ["modal"], null, null);
  const closeButton = createEl("button", ["modal-close-btn"], {
    type: "button",
    id: "modal-close-btn",
  });
  const strongText = createEl("strong", null, null, "X");
  const modalInfoContainer = createEl("div", ["modal-info-container"]);
  const modalImg = createEl("img", ["modal-img"], {
    src: `${imgSizeCheck(person.picture)}`,
    alt: `Profile picture of ${person.name.first} ${person.name.last}`,
  });
  const modalName = createEl(
    "div",
    ["modal-name", "cap"],
    { id: "name" },
    `${person.name.first} ${person.name.last}`
  );
  const modalEmail = createEl(
    "div",
    ["modal-text", "modal-email"],
    null,
    `${person.email}`
  );
  const modalCity = createEl(
    "div",
    ["modal-text", "modal-city", "cap"],
    null,
    `${person.location.city}`
  );
  const modalPhone = createEl(
    "div",
    ["modal-test", "modal-phone"],
    null,
    `${person.phone}`
  );
  const modalAddress = createEl(
    "div",
    ["modal-text", "modal-address"],
    null,
    `${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state}`
  );
  const modalBirthday = createEl(
    "div",
    ["modal-text", "modal-birthday"],
    null,
    `${formatBday(person.dob.date)}`
  );
  const btnContainer = createEl("div", ["modal-btn-container"], {
    type: "button",
  });
  const prevBtn = createEl(
    "button",
    ["modal-prev", "btn"],
    { type: "button", id: "modal-prev" },
    "Prev"
  );
  const nextBtn = createEl(
    "button",
    ["modal-next", "btn"],
    { type: "button", id: "modal-next" },
    "Next"
  );

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
function createEl(element, classes = null, obj = null, innerText = null) {
  const ele = document.createElement(element);
  if (classes !== null) {
    if (classes.length >= 2) ele.classList.add(...classes);
    else ele.classList.add(classes);
  }

  for (const [key, value] of Object.entries({ ...obj })) {
    ele.setAttribute(`${key}`, value);
  }

  if (innerText !== null) ele.innerText = innerText;

  return ele;
}

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
