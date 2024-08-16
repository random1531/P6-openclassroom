const addfilterkshtml = document.querySelector("#filer");
const addworkshtml = document.querySelector("#portfolio .gallery");
let filterselector = document.querySelectorAll("#filer");
let work = null


async function works() {
    const initworks = await fetch("http://localhost:5678/api/works");
    return await initworks.json();
}
works()


document.querySelector("#login_page").addEventListener("click", (e) => {
    window.location.href = "./html/login.html"
})

/**init at load */
async function addworks() {
    const arrayworks = await works();
    arrayworks.forEach(element => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        addworkshtml.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
        img.src = element.imageUrl;
        figcaption.textContent = element.title
    });
}
addworks()


//Récupération des catégories 
async function categories() {
    const initcategories = await fetch("http://localhost:5678/api/categories");
    return await initcategories.json();
}
categories()

//A joute des catégories filtre ainsi que leur id
async function addcategories() {
    const catarray = await categories();
    catarray.forEach(element => {
        const namefilter = document.createElement("button");
        namefilter.textContent = element.name
        addfilterkshtml.appendChild(namefilter);
        namefilter.setAttribute("id", element.id);
        namefilter.classList.add("inactif")
    });
}
addcategories()



// fonction de filtre
document.addEventListener("click", async function (e) {    
    if (e.target.closest("#filer button")) {
        const arrayfiltered = await works();
        if (e.target.id !== "null") {
            const arrayf = arrayfiltered.filter(element => element.categoryId == e.target.id);
            addworkshtml.innerHTML = "";
            arrayf.forEach(element => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const figcaption = document.createElement("figcaption");
                addworkshtml.appendChild(figure);
                figure.appendChild(img);
                figure.appendChild(figcaption);
                img.src = element.imageUrl;
                figcaption.textContent = element.title;
            });
        } else {
            addworkshtml.innerHTML = "";
            addworks();
        }
    }
});


//changer filtre actif
document.querySelector("#filer").addEventListener("click", (e) => {
    if (e.target.id !== "filer") {
        const btnfilterid = e.target.id;
        const btnfilter = document.getElementById(btnfilterid);
        document.querySelectorAll("#filer button").forEach(button => {
        button.classList.remove("activate"); 
        button.classList.add("inactif"); 
        });
        btnfilter.classList.add("activate");     
        btnfilter.classList.remove("inactif");       
    }else{
        document.querySelectorAll("#filer button").forEach(button => {
            button.classList.remove("inactif");       
            });
               
    }
});
