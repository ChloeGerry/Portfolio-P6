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
        openingTheModal();
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

// declaration of the variables in the root
let allWorks = null;
let objects = null;
let apartments = null;
let hostelsAndRestaurants = null;
let worksData = null;
let categoriesData = null;
const objectsCategoryId = 1;
const apartmentsCategoryId = 2;
const hostelsAndRestaurantsCategoryId = 3;

// function to add dynamically the works in the gallery
const updateWorks = (worksData) => { 
    const gallery = document.querySelector(".js-gallery");
    gallery.innerHTML = "";

    worksData.forEach(work => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", `${work.id}`);
        gallery.appendChild(figure);
        figure.innerHTML = 
        `<img class="js-pictures" crossorigin="anonymous" src="${work.imageUrl}" />
        <figcaption class="pictures__description">${work.title}</figcaption>`;
    })
}

// function to add dynamically the new work in the modal
const addNewWorkModal = (addWork) => { 
    const modalPicturesGallery = document.querySelector(".js-gallery--small");

    const figure = document.createElement("figure");
    figure.setAttribute("data-id", `${addWork.id}`);
    modalPicturesGallery.appendChild(figure);
    figure.innerHTML =
        `<div class="modal__trashIconWrapper">
            <i class="fa-regular fa-trash-can modal__trashIcon js-modal__trashIcon" data-id="${addWork.id}"></i>
        </div>
        <img class="modal__pictures js-modal__pictures" crossorigin="anonymous" src="${addWork.imageUrl}" />
        <figcaption class="modal__editing">éditer</figcaption>`;
}

// function to add dynamically the new work in the gallery
const addNewWorkGallery = (addWork) => {
    const gallery = document.querySelector(".js-gallery");
    const figure = document.createElement("figure");

    figure.setAttribute("data-id", `${addWork.id}`);
    gallery.appendChild(figure);
    figure.innerHTML = 
        `<img class="js-pictures" crossorigin="anonymous" src="${addWork.imageUrl}" />
        <figcaption class="pictures__description">${addWork.title}</figcaption>`;
}

// function to delete dynamically the new work
const deleteNewWork = (addWork) => {
    const deleteIcon = document.querySelectorAll(".js-modal__trashIcon");
    let workToDeleteId = 0;
    let deleteIconId = 0;

    for (let i = 0; i < deleteIcon.length; i++) {
        deleteIcon[i].addEventListener("click", () => {
            deleteIconId = parseInt(deleteIcon[i].dataset.id);

            if (addWork.id === deleteIconId) {
                workToDeleteId = addWork.id;

                fetch(`http://localhost:5678/api/works/${workToDeleteId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then((result) => {
                    if (result.ok) {
                        const refreshPortfolioModale = document.querySelector(`figure[data-id="${workToDeleteId}"]`);
                        refreshPortfolioModale.remove();
                        const refreshPortfolio = document.querySelector(`figure[data-id="${workToDeleteId}"]`);
                        refreshPortfolio.remove();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        })
    }
}

// fontion for filter the works by categories
const updateCategories = (categories) => {
    const navigationMenuProjects = document.querySelector(".js-navigationMenu--projects");

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

    const updateCategoriesColor = (category) => {
        resetColor();
        category.style.color = "#FFFFFF";
        category.style.backgroundColor = "#1D6154";
    }

    const filter = (category, categoryId) => {
        const gallery = document.querySelector(".js-gallery");
        updateCategoriesColor(category);

        const filterWorks = worksData.filter((work) => {
            return work.categoryId === categoryId;
        })

        gallery.innerHTML = "";
        updateWorks(filterWorks);
    }

    allWorks.addEventListener("click", () => {
        updateCategoriesColor(allWorks);
        updateWorks(worksData);
    })

    objects.addEventListener("click", () => filter(objects, objectsCategoryId));

    apartments.addEventListener("click", () => filter(apartments, apartmentsCategoryId));

    hostelsAndRestaurants.addEventListener("click", () => filter(hostelsAndRestaurants, hostelsAndRestaurantsCategoryId));
}

// event to make appears the login page
const headerNavigation = document.querySelectorAll(".js-header__navigation");
const loginNavigation = headerNavigation[2];
const logout = headerNavigation[3];

loginNavigation.addEventListener("click", () => {
    const loginWrapper = document.querySelector(".js-login");
    const mainContent = document.querySelector(".js-main__content");
    loginNavigation.style.fontWeight = "600";
    loginWrapper.style.display = "initial";
    mainContent.style.display = "none";
})

// function to validate the authentification
let token = null;
const loginSubmit = () => {
    const gallery = document.querySelector(".js-gallery");
    const navigationMenuProjects = document.querySelector(".js-navigationMenu--projects");
    const loginWrapper = document.querySelector(".js-login");
    const mainContent = document.querySelector(".js-main__content");
    const emailLabel = document.querySelector(".js-emailLabel");
    const emailInput = document.querySelector(".js-emailInput");
    const passwordLabel = document.querySelector(".js-passwordLabel");
    const passwordInput = document.querySelector(".js-passwordInput");
    const changeBanner = document.querySelector(".js-change__banner");
    const modificationLinks = document.querySelectorAll(".js-change__wrapper");
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
                loginNavigation.style.display = "none";
                logout.style.display = "initial";
                navigationMenuProjects.style.display = "none";
                gallery.style.marginTop = "64px";
                emailLabel.innerText = "";
                passwordLabel.innerText = "";

                for (let i = 0; i < modificationLinks.length; i++) {
                    modificationLinks[i].style.display = "initial";
                }
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

logout.addEventListener("click", () => {
    window.location.reload();
})

// function to open the modal
const openingTheModal = () => {
    const modalBackground = document.querySelector(".js-modal__fullPage");
    const modalGallery = document.querySelector(".js-modal__gallery");
    const changePortfolio = document.querySelector("#change__portfolio");

    changePortfolio.addEventListener("click", () => {
        modalGallery.style.display = "initial";
        modalBackground.style.position = "fixed";
    })
}

// function to fill the modal header
const modalPicturesGallery = document.querySelector(".js-gallery--small");
const modalHeader = () => {
    const modalGallery = document.querySelector(".js-modal__gallery");
    
    modalGallery.innerHTML =
        `<div class="modal">
            <div class="modal__closingIconWrapper">
                <i class="fa-solid fa-xmark modal__closingIcon js-modal__closingIcon"></i>
            </div>
            <h2 class="modal__title">Galerie photo</h2>
        </div>`;

    modalPicturesGallery.innerHTML = `<i class="fa-solid fa-up-down-left-right modal__moveIcon js-modal__moveIcon"></i>`
}

// function to fill the modal footer
const modalFooter = () => {
    const modalGallery = document.querySelector(".js-modal__gallery");

    modalGallery.innerHTML = modalGallery.innerHTML +
    `<div class="modal__buttonWrapper">
        <div class="modal__ligne"></div>
        <button type="button" class="button modal__button js-button__addPicture--open">
            Ajouter une photo
        </button>
        <a href="#" class="modal__deleteText js-modal__deleteAllGallery">
            Supprimer la galerie
        </a>
    </div>`;
}

// function to delete a work
const deleteWork = () => {
    const deleteIcon = document.querySelectorAll(".js-modal__trashIcon");
    let workToDeleteId = null;
    let deleteIconId = null;
    for (let i = 0; i < deleteIcon.length; i++) {
        deleteIcon[i].addEventListener("click", () => {
            worksData.forEach(work => {
                deleteIconId = parseInt(deleteIcon[i].dataset.id);
               
                if (work.id === deleteIconId) {
                    workToDeleteId = work.id;

                    fetch(`http://localhost:5678/api/works/${workToDeleteId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    .then((result) => {
                        if (result.ok) {
                            worksData = worksData.filter(work => work.id !== workToDeleteId);
                            const refreshPortfolioModale = document.querySelector(`figure[data-id="${workToDeleteId}"]`);
                            refreshPortfolioModale.remove();
                            const refreshPortfolio = document.querySelector(`figure[data-id="${workToDeleteId}"]`);
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

// function to delete all the works
const deleteAllGallery = () => {
    const gallery = document.querySelector(".js-gallery");
    const deleteAll = document.querySelector(".js-modal__deleteAllGallery");
    let workToDeleteId = null;

    deleteAll.addEventListener("click", () => {
        worksData.forEach(work => {
            workToDeleteId = work.id;
            
            fetch(`http://localhost:5678/api/works/${workToDeleteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((result) => {
                if (result.ok) {
                    const modalPicturesGallery = document.querySelector(".js-gallery--small");
                    modalPicturesGallery.innerHTML = "";
                    gallery.innerHTML = "";
                }
            })
            .catch((error) => {
                console.log(error);
            });
        })
    })
}

// function to fill the body for the modal
const modalAddPicture = () => {
    const modalGallery = document.querySelector(".js-modal__gallery");

    modalGallery.innerHTML =
        `<div class="modal">
            <div class="modal__header">
                <i class="fa-solid fa-arrow-left-long modal__leftArrowIcon js-modal__leftArrowIcon"></i>
                <i class="fa-solid fa-xmark modal__closingIcon js-modal__closingIcon"></i>
            </div>
            <h2 class="modal__title">Ajout photo</h2>
            <div class="modal__addPictureWrapper js-modal__addPictureWrapper">
                <img src="../FrontEnd/assets/icons/landscape.svg" alt="Image icon" class="modal__landscapeIcon" />
                <form method="post" class="button modal__addPicture--button js-modal__addPicture--button">
                    <label for="image" class="modal__imageLabel">+Ajouter photo</label>
                    <input id="image" type="file" accept=".jpeg, .png, .jpg" class="modal__fileInput js-modal__fileInput" required />
                </form>
                <p class="modal__imageFormat">jpg, png : 4mo max</p>
            </div>
            <form method="post" class="modal__form js-modal__form">
                <label for="title" class="modal__pictureTitle">
                    Titre
                </label>
                <input type="text" id="title" class="modal__pictureTitleInput js-modal__pictureTitleInput" name="title" required />
                <label for="categorie" class="modal__pictureCategory">
                    Catégorie
                </label>
                <select id="categorie" class="modal__pictureCategoryInput js-modal__pictureCategoryInput" required>
                    <option value=""></option>
                    <option value="Objets">Objets</option>
                    <option value="Appartements">Appartements</option>
                    <option value="Hotels & restaurants">Hotels & restaurants</option>
                </select>
                <div class="modal__addPictureFooter">
                    <div class="modal__ligne"></div>
                    <p class="js-modal__errorMessage"></p>
                    <button type="submit" class="button modal__buttonSubmitPicture js-modal__buttonSubmitPicture">
                        Valider
                    </button>
                </div>
            </form>
        </div>`;
}

// function to return to the previous modal
const previousModale = () => {
    const modalGallery = document.querySelector(".js-modal__gallery");
    const leftArrow = document.querySelector(".js-modal__leftArrowIcon");

    leftArrow.addEventListener("click", () => {
        modalGallery.innerHTML = "";
        updateModalWorks(worksData);
    })
}

// function to refresh the modal to access to the interface that allow to add an image
const addPictureModalFunction = () => {
    const modalGallery = document.querySelector(".js-modal__gallery");
    const addPictureModal = document.querySelector(".js-button__addPicture--open");

    addPictureModal.addEventListener("click", () => {
        modalGallery.innerHTML = "";
        modalAddPicture();
        previousModale();
        closingModale();
        addAnImage();
    })
}

//function to add an image 
const addAnImage = () => {
    let loadFile = "";
    let fileReader = new FileReader();
    let categoryId = null;
    const addPictureForm = document.querySelector(".js-modal__addPicture--button");
    const fileImage = document.querySelector(".js-modal__fileInput");
    const loadPicture = document.querySelector(".js-modal__addPictureWrapper");
    const modalForm = document.querySelector(".js-modal__form");
    const imageTitle = document.querySelector(".js-modal__pictureTitleInput");
    const categoryInput = document.querySelector(".js-modal__pictureCategoryInput");
    const submitPictureButton = document.querySelector(".js-modal__buttonSubmitPicture");

    addPictureForm.addEventListener("change", (event) => {
        event.preventDefault();
        loadFile = fileImage.files[0];

        fileReader.addEventListener("loadend", () => {
            loadPicture.innerHTML = `<img class="js-modal__newPicture" src="${fileReader.result}" alt="New picture" />`;
            const newPicture = document.querySelector(".js-modal__newPicture");
            newPicture.style.width = "129px";
            newPicture.style.height = "170px";
        })
        fileReader.readAsDataURL(loadFile);
    });

    modalForm.addEventListener("change", (event) => {
        event.preventDefault();

        if (!categoryInput.value) {
            categoryId = null;
        } else if (categoryInput.value === "Objets") {
            categoryId = objectsCategoryId;
        } else if (categoryInput.value === "Appartements") {
            categoryId = apartmentsCategoryId;
        } else if (categoryInput.value === "Hotels & restaurants") {
            categoryId = hostelsAndRestaurantsCategoryId;
        }

        const fileType = loadFile["type"];
        const validImagesTypes = ["image/jpeg", "image/png", "image/jpg"];
        const errorForm = document.querySelector(".js-modal__errorMessage");

        if (validImagesTypes.includes(fileType) && imageTitle.value && typeof(categoryId) === "number") {
            submitPictureButton.style.backgroundColor = "#1D6154";
            submitPictureButton.style.border = "#1D6154";
            errorForm.style.display = "none"
        } else {
            errorForm.innerText = `Vérifiez que tous les champs soient remplis !`;
            errorForm.style.marginTop = "24px";
            submitPictureButton.style.backgroundColor = "#A7A7A7";
            submitPictureButton.style.border = "#A7A7A7";
        }
    });

    modalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", loadFile);
        formData.append("title", imageTitle.value);
        formData.append("category", categoryId);

        fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
        })
        .then((result) => {
            if (result.ok) {
                return result.json();
            }
        })
        .then((addWork) => {
            updateModalWorks(worksData);
            addNewWorkGallery(addWork);
            addNewWorkModal(addWork);
            deleteNewWork(addWork);
        })
        .catch((error) => {
            console.log(error);
        }); 
    })
}

// function for update the works dynamically in the modale 
const modalGallery = document.querySelector(".js-modal__gallery");
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
    deleteAllGallery();
    closingModale();
    addPictureModalFunction();
}

// function to close the modal with the icon
const closingModale = () => {
    const modalBackground = document.querySelector(".js-modal__fullPage");
    const modalGallery = document.querySelector(".js-modal__gallery");
    const closeIcon = document.querySelector(".js-modal__closingIcon");

    closeIcon.addEventListener("click", () => {
        modalGallery.style.display = "none";
        modalBackground.style.position = "initial";
    })
}

// function to close the modal by clicking outside the modal
const modalBackground = document.querySelector(".js-modal__fullPage");
modalBackground.addEventListener("click", () => {
    const modalGallery = document.querySelector(".js-modal__gallery");
    modalGallery.style.display = "none";
    modalBackground.style.position = "initial";
})

// compte test : 
// email = sophie.bluel@test.tld
// password = S0phie