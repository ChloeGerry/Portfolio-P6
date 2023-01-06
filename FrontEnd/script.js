// compte test : 
// email = sophie.bluel@test.tld
// password = S0phie

fetch("http://localhost:5678/api/works")
    .then((result) => {
        if (result.ok) {
            return result.json();
        }
    })
    .then((works) => {
        worksData = works;
        updateWorks(worksData);
    })
    .catch((error) => {
        console.log(error);
    });

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

const updateWorks = (worksData) => {
    const gallery = document.querySelector(".js-gallery");
    
    worksData.forEach(work => {
        const figure = document.createElement("figure");
        gallery.appendChild(figure);
        figure.innerHTML = 
        `<img class="js-pictures" crossorigin="anonymous" src="${work.imageUrl}" />
        <figcaption class="pictures__description">${work.title}</figcaption>`;
    })
}

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

    allWorks.addEventListener("click", () => {
        resetColor();
        allWorks.style.color = "#FFFFFF";
        allWorks.style.backgroundColor = "#1D6154";
        const gallery = document.querySelector(".js-gallery");
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
        const gallery = document.querySelector(".js-gallery");
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
        const gallery = document.querySelector(".js-gallery");
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
        const gallery = document.querySelector(".js-gallery");
        gallery.innerHTML = "";
        updateWorks(filterHostelsAndRestaurants);
    })
}

const headerNavigation = document.querySelectorAll(".js-header__navigation");
const loginNavigation = headerNavigation[2];
const loginWrapper = document.querySelector(".js-login");
const mainWrapper = document.querySelector(".js-main");
const mainContent = document.querySelector(".js-main__content");

loginNavigation.addEventListener("click", () => {
    loginNavigation.style.fontWeight = "600";
    loginWrapper.style.display = "initial";
    mainContent.style.display = "none";
})

mainWrapper.addEventListener("click", () => {
    loginNavigation.style.fontWeight = "400";
    loginWrapper.style.display = "none";
    mainContent.style.display = "initial";
})

const sendEmail = () => {
    const emailInput = document.querySelector(".js-emailInput");
    emailInput.addEventListener("submit", (event) => {
        const email = event.target.value;
    })
}

const sendPassword = () => {
    const passwordInput = document.querySelector(".js-passwordInput");
    passwordInput.addEventListener("submit", (event) => {
        const password = event.target.value;
    })
}

sendEmail();
sendPassword();

fetch("http://localhost:5678/api/users/login"), {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify()
}