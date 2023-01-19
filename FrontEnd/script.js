// call API to get back the works
fetch("http://localhost:5678/api/works")
    .then((result) => {
        if (result.ok) {
            return result.json();
        }
    })
    .then((works) => {
        worksData = works;
        updateWorks(worksData);
        updateModalWorks(worksData);
    })
    .catch((error) => {
        console.log(error);
    });

// call API to get back the categories
fetch("http://localhost:5678/api/categories")
    .then((result) => {
        if (result.ok) {
            return result.json();
        }
    })
    .then((categories) => {
        categoriesData = categories;
        updateCategories(categories);
    })
    .catch((error) => {
        console.log(error);
    });

let allWorks = null;
let objects = null;
let apartments = null;
let hostelsAndRestaurants = null;
let worksData = null;
let categoriesData = null;
const gallery = document.querySelector(".js-gallery");

const updateWorks = (worksData) => { 
    worksData.forEach(work => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", `${work.id}`);
        gallery.appendChild(figure);
        figure.innerHTML = 
        `<img class="js-pictures" crossorigin="anonymous" src="${work.imageUrl}" />
        <figcaption class="pictures__description">${work.title}</figcaption>`;
    })
}

// selection of the DOM
const body = document.querySelector(".js-body");
const headerNavigation = document.querySelectorAll(".js-header__navigation");
const loginNavigation = headerNavigation[2];
const loginWrapper = document.querySelector(".js-login");
const mainContent = document.querySelector(".js-main__content");
const input = document.querySelectorAll("form input");
const emailLabel = document.querySelector(".js-emailLabel");
const emailInput = document.querySelector(".js-emailInput");
const passwordLabel = document.querySelector(".js-passwordLabel");
const passwordInput = document.querySelector(".js-passwordInput");
const submitButton = document.querySelector(".js-loginButton");
const changeBanner = document.querySelector(".js-change__banner");
const modificationLinks = document.querySelectorAll(".js-change__wrapper");
const modalGallery = document.querySelector(".js-modal__gallery");
const modalPicturesGallery = document.querySelector(".js-gallery--small");
const navigationMenuProjects = document.querySelector(".js-navigationMenu--projects");
// const closeIcon = document.querySelector(".js-modal__closingIcon");

// filter the works by categories
const updateCategories = (categories) => {
    const list = document.createElement("ul");
    list.classList.add("category__wrapper");
    navigationMenuProjects.appendChild(list);
    const allList = document.getElementsByClassName("category");

    list.innerHTML = `<li class="category"><a>Tous</a></li>`;
    
    categories.forEach(categorie => {
        list.innerHTML = `${list.innerHTML} <li class="category"><a>${categorie.name}</a></li>`;
    })

    allWorks = allList[0];
    objects = allList[1];
    apartments = allList[2];
    hostelsAndRestaurants = allList[3];
    
    const resetColor = () => {
        const allListCategories = document.querySelectorAll(".category");
        allListCategories.forEach(categorie => {
            categorie.style.color = "#1D6154";
            categorie.style.backgroundColor = "#FFFEF8";
        })
    }

    allWorks.addEventListener("click", () => {
        resetColor();
        allWorks.style.color = "#FFFFFF";
        allWorks.style.backgroundColor = "#1D6154";
        gallery.innerHTML = "";
        updateWorks(worksData);
    })

    objects.addEventListener("click", function () {
        resetColor();
        objects.style.color = "#FFFFFF";
        objects.style.backgroundColor = "#1D6154";
        const filterObjects = worksData.filter(function (work) {
            return work.categoryId === 1;
        })
        gallery.innerHTML = "";
        updateWorks(filterObjects);
    })

    apartments.addEventListener("click", () => {
        resetColor();
        apartments.style.color = "#FFFFFF";
        apartments.style.backgroundColor = "#1D6154";
        const filterApartments = worksData.filter(function (work) {
            return work.categoryId === 2;
        })
        gallery.innerHTML = "";
        updateWorks(filterApartments);
    })

    hostelsAndRestaurants.addEventListener("click", () => {
        resetColor();
        hostelsAndRestaurants.style.color = "#FFFFFF";
        hostelsAndRestaurants.style.backgroundColor = "#1D6154";
        const filterHostelsAndRestaurants = worksData.filter(function (work) {
            return work.categoryId === 3;
        })
        gallery.innerHTML = "";
        updateWorks(filterHostelsAndRestaurants);
    })
}

// login page connexion & call API to send data for the authentification
loginNavigation.addEventListener("click", () => {
    loginNavigation.style.fontWeight = "600";
    loginWrapper.style.display = "initial";
    mainContent.style.display = "none";
})

let token = "";
const loginSubmit = () => {
    const userLogin = document.querySelector(".js-login__form");
    userLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = {
            email: emailInput.value,
            password: passwordInput.value
        };
        const chargeUtile = JSON.stringify(login);

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: chargeUtile
        })
            .then((result) => {
                if (result.ok) {
                    loginNavigation.style.fontWeight = "400";
                    loginWrapper.style.display = "none";
                    mainContent.style.display = "initial";
                    changeBanner.style.display = "initial";
                    loginNavigation.innerText = "logout";
                    navigationMenuProjects.style.display = "none";
                    gallery.style.marginTop = "64px";
                    emailLabel.innerText = "";
                    passwordLabel.innerText = "";
                    for (let i = 0; i < modificationLinks.length; i++) {
                        modificationLinks[i].style.display = "initial";
                    }
                    modalGallery.style.display = "initial";
                    body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    // openingTheModal();
                    return result.json();
                }
                if (result.status === 404) {
                    passwordLabel.innerText = "";
                    emailLabel.innerText = "Adresse email invalide !";
                    emailLabel.style.margin = "8px 0px 32px 0px";
                    emailInput.style.marginBottom = "0px";
                } else if (result.status === 401) {
                    emailLabel.innerText = "";
                    passwordLabel.innerText = "Mot de passe invalide !";
                    passwordLabel.style.margin = "8px 0px 32px 0px"
                    passwordInput.style.marginBottom = "0px";
                }
            })
            .then((login) => {
                token = login.token;
            })
            .catch((error) => {
                console.log(error);
            });
    });
}

loginSubmit();

//open the modal
const openingTheModal = () => {
    console.log("fonction");
    const changePortfolio = document.querySelector("#change__portfolio");
    changePortfolio.addEventListener("click", () => {
        console.log("click");
        modalGallery.style.display = "initial";
        // body.style.opacity = "0.6";
        body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    })
}

// function for the modal header
const modalHeader = () => {
    modalGallery.innerHTML =
    `<div class="modal">
        <i class="fa-solid fa-xmark modal__closingIcon js-modal__closingIcon"></i>
        <h2 class="modal__title">Galerie photo</h2>
    </div>`;

    modalPicturesGallery.innerHTML = `<i class="fa-solid fa-up-down-left-right modal__moveIcon"></i>`;
}

// function for the modal footer
const modalFooter = () => {
    modalGallery.innerHTML = modalGallery.innerHTML +
    `<div class="modal__buttonWrapper">
        <div class="modal__ligne"></div>
        <button type="button" class="button modal__button js-button__addPicture--open">
            Ajouter une photo
        </button>
        <a href="#" class="modal__deleteText">
            Supprimer la galerie
        </a>
    </div>`;
}

// function for delete a work
const deleteWork = () => {
    const deleteIcon = document.querySelectorAll(".js-modal__trashIcon");
    let workToDelete = 0;
    let deleteIconId = 0;
    for (let i = 0; i < deleteIcon.length; i++) {
        deleteIcon[i].addEventListener("click", () => {
            worksData.forEach(work => {
                deleteIconId = parseInt(deleteIcon[i].dataset.id);
                if (work.id === deleteIconId) {
                    workToDelete = work.id;
                    fetch(`http://localhost:5678/api/works/${workToDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then((result) => {
                            if (result.ok) {
                                const refreshPortfolioModale = document.querySelector(`figure[data-id="${workToDelete}"]`);
                                refreshPortfolioModale.remove();
                                const refreshPortfolio = document.querySelector(`figure[data-id="${workToDelete}"]`);
                                refreshPortfolio.remove();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
        })
    }
}

const modalAddPicture = () => {
    modalGallery.innerHTML =
    `<div class="modal">
        <div class="modal__header">
            <i class="fa-solid fa-arrow-left-long modal__leftArrowIcon js-modal__leftArrowIcon"></i>
            <i class="fa-solid fa-xmark modal__closingIcon js-modal__closingIcon"></i>
        </div>
        <h2 class="modal__title">Ajout photo</h2>
        <div class="modal__addPictureWrapper">
            <img src="../FrontEnd/assets/icons/landscape.svg" alt="Image icon" class="modal__landscapeIcon" />
            <button type="button" class="button modal__addPicture--button js-modal__addPicture--button">
                + Ajouter photo
            </button>
            <p class="modal__imageFormat">jpg, png : 4mo max</p>
        </div>
        <form method="post" class="modal__form">
            <label for="title" class="modal__pictureTitle">
                Titre
            </label>
            <input type="text" id="title" class="modal__pictureTitleInput" />
            <label for="categorie" class="modal__pictureCategory">
            Catégorie
            </label>
            <select id="categorie" class="modal__pictureCategoryInput">
                <option>Tous</option>
                <option>Objets</option>
                <option>Appartements</option>
                <option>Hôtels & restaurants</option>
            </select>
        </form>
        <div class="modal__addPictureFooter">
            <div class="modal__ligne"></div>
            <button type="submit" class="button modal__buttonSubmitPicture js-modal__buttonSubmitPicture">
                Valider
            </button>
        </div>
    </div>`;
    const submitPictureButton = document.querySelector(".js-modal__buttonSubmitPicture");
    submitPictureButton.disabled = "true";
}

// return to the previous modal
const previousModale = () => {
    const leftArrow = document.querySelector(".js-modal__leftArrowIcon");
    leftArrow.addEventListener("click", () => {
        modalGallery.innerHTML = "";
        updateModalWorks(worksData);
    })
}

// modale for adding a picture
const addPictureModalFunction = () => {
    const addPictureModal = document.querySelector(".js-button__addPicture--open");
    addPictureModal.addEventListener("click", () => {
        modalGallery.innerHTML = "";
        modalAddPicture();
        previousModale();
    })
}

// function for update the works in the modale 
const updateModalWorks = (worksData) => {
    modalHeader();
    modalGallery.appendChild(modalPicturesGallery);
    worksData.forEach(work => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", `${work.id}`);
        modalPicturesGallery.appendChild(figure);
        figure.innerHTML =
        `<div class="modal__trashIconWrapper">
            <i class="fa-regular fa-trash-can modal__trashIcon js-modal__trashIcon" data-id="${work.id}"></i>
        </div>
        <img class="modal__pictures js-modal__pictures" crossorigin="anonymous" src="${work.imageUrl}" />
        <figcaption class="modal__editing">éditer</figcaption>`;
    })
    modalFooter();
    deleteWork();
    closingModale();
    addPictureModalFunction();
}

// for closing the modal
const closingModale = () => {
    const closeIcon = document.querySelector(".js-modal__closingIcon");
    closeIcon.addEventListener("click", () => {
        modalGallery.style.display = "none";
        body.style.backgroundColor = "#FFFEF8";
    })
}

mainContent.addEventListener("click", () => {
    modalGallery.style.display = "none";
    body.style.backgroundColor = "#FFFEF8";
})

// compte test : 
// email = sophie.bluel@test.tld
// password = S0phie