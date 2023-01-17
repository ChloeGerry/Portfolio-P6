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
        manipulateWorks(worksData);
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
const navigationMenuProjects = document.querySelector(".js-navigationMenu--projects");
const addPictureButton = document.querySelector(".js-modal--addPicture");
const modalForAddPicture = document.querySelector(".js-modal__addPicture");
const closeIcon = document.querySelector(".js-modal__closingIcon");
// const deleteIcon = document.querySelectorAll(".js-modal__trashIcon");

// modalForAddPicture.style.display = "initial";

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

// function for add the works in the modale
let token = "";
const manipulateWorks = (worksData) => {
    const modalPicturesGallery = document.querySelector(".js-gallery--small");

    worksData.forEach(work => {
        const figure = document.createElement("figure");
        modalPicturesGallery.appendChild(figure);
        figure.innerHTML = 
        `<div class="modal__trashIconWrapper">
            <i class="fa-regular fa-trash-can modal__trashIcon js-modal__trashIcon"></i>
        </div>
        <img class="modal__pictures js-modal__pictures" crossorigin="anonymous" src="${work.imageUrl}" />
        <figcaption class="modal__editing">éditer</figcaption>`;
    })
    const deleteIcon = document.querySelectorAll(".js-modal__trashIcon");
    let workToDelete = 0;
    for (let i = 0; i < deleteIcon.length; i++) {
        deleteIcon[i].addEventListener("click", () => {
            worksData.forEach(work => {
                console.log("boucle");
                console.log(work);
                if (i === work) {
                    console.log("if");
                    workToDelete = work;
                    console.log(workToDelete);
                    fetch(`http://localhost:5678/api/works/${workToDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then((result) => {
                            console.log(result);
                            if (result.ok) {
                                console.log("je fonctionne");
                                // updateWorks(worksData);
                                // manipulateWorks(worksData);
                            }
                        })
                        // .then((works) => {
                        //     worksData = works;
                        //     updateWorks(worksData);
                        //     manipulateWorks(worksData);
                        // })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
        })
    }
}

// login page connexion & call API to send data
loginNavigation.addEventListener("click", () => {
    loginNavigation.style.fontWeight = "600";
    loginWrapper.style.display = "initial";
    mainContent.style.display = "none";
})

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
                    // document.querySelector(".js-fullContent").style.opacity = "0.5"
                    body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    modalGallery.style.display = "initial";
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

//for closing the modal
closeIcon.addEventListener("click", () => {
    modalGallery.style.display = "none";
    body.style.backgroundColor = "#FFFEF8";

})

mainContent.addEventListener("click", () => {
    modalGallery.style.display = "none";
    body.style.backgroundColor = "#FFFEF8";
})

//delete a work
// deleteIcon.addEventListener("click", () => {
//     console.log("delete");
// })



// modale for adding a picture
// addPictureButton.addEventListener("click", () => {
//     modalForAddPicture.style.display = "initial";
//     modalGallery.style.display = "none";
// })

// compte test : 
// email = sophie.bluel@test.tld
// password = S0phie