const addfilterkshtml = document.querySelector("#filer");
const addworkshtml = document.querySelector("#portfolio .gallery");
let filterselector = document.querySelectorAll("#filer");
const token = localStorage.getItem('tok')
const projecthide = document.querySelector(".modal__project")
const modalactiv = document.querySelector('#modal__block');
let work = null


async function works() {
    const initworks = await fetch("http://localhost:5678/api/works");
    return await initworks.json();
}
works()


document.querySelector("#login_page").addEventListener("click", (e) => {
    const login = document.querySelector('#login_page')
    if(login.textContent === "login"){        
    window.location.href = "./html/login.html"
}
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


//enter in modal
document.querySelectorAll('.fa-pen-to-square').forEach((icon) => {
    icon.addEventListener("click", () => {
        modalactiv.style.display = 'flex';
        document.querySelector('#forms_add_work').style.display = 'none';
        document.querySelector('#adds').style.display = 'flex';
        document.querySelector("#btn_validate").style.display = 'none';
        document.querySelector("#back").style.display = 'none';
        document.querySelector("#title_modal").textContent = "Galerie photo";
        document.querySelector('#messageserror').textContent  = '';
        document.querySelector('#messages').textContent  = '';
    });
});


//exit modal
document.querySelector('#modal__block').addEventListener("click", (e) => {
    if (e.target.id === 'modal__block' || e.target.classList.contains('fa-xmark')) {
        exitmodal()
    }
})
function exitmodal() {
    modalactiv.style.display = 'none';
    addworkshtml.innerHTML = "";
    addworks()
    document.querySelector('.displ').display = 'flex';
    projecthide.style.display = 'flex'
    document.querySelector('.modal__project').innerHTML = ""
    picturemodal()
}

//back to delete
document.querySelector('#back').addEventListener("click", (e) => {
    if (e.target.id === 'back') {
        document.querySelector('.displ').display = 'flex';
        document.querySelector('#forms_add_work').style.display = 'none'
        projecthide.style.display = 'flex'
        document.querySelector('.modal__project').innerHTML = ""
        document.querySelector('#adds').style.display = 'flex'
        document.querySelector("#btn_validate").style.display = 'none'
        document.querySelector("#back").style.display = 'none'
        document.querySelector("#title_modal").textContent = "Galerie photo"
        picturemodal()
    }
})


//modal project picture import
async function picturemodal() {
    const image = document.querySelector('.modal__project')
    const arrayworkss = await works();
    arrayworkss.forEach(element => {
        const img = document.createElement("img");
        const div = document.createElement("div");
        const trash = document.createElement("i")
        const id = document.createElement("p")
        image.appendChild(div)
        div.appendChild(trash);
        div.appendChild(img);
        div.appendChild(id)
        div.classList.add("displ")
        img.classList.add("modal__picture")
        trash.id = element.id
        trash.classList.add("fa-trash-can", "fa-solid")
        img.src = element.imageUrl;
    });
}
picturemodal()



//Fonction deleted
document.addEventListener("click", async function (e) {
    if (e.target.classList.contains('fa-trash-can')) {
        const arrayworksss = document.querySelector(".modal__project");
        const deleted = await fetch('http://localhost:5678/api/works/' + e.target.id, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer ' + token
            }
        })
        if (deleted.status === 204) {
            arrayworksss.innerHTML = "";
            picturemodal()
        } else {
            console.log("error")
        }
    }

});

document.getElementById('imageUpload').addEventListener('change', function (e) {
    const updateimg = document.querySelector("#preview_img")
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            updateimg.src = event.target.result;
            updateimg.style.display = 'flex';
            document.querySelector(".fa-image").style.display = 'none';
            document.querySelector(".image-info").style.display = 'none';
            document.querySelector(".btn").style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

//Validation possible si champ titre est remplie
const textinput = document.querySelector("#titre1")
const btnvalid = document.querySelector("#btn_validate")
textinput.addEventListener('input', () => {
    if (textinput.value === "") {
        btnvalid.disabled = true;
        btnvalid.style.backgroundColor = 'grey';
    } else {
        btnvalid.disabled = false;
        btnvalid.style.backgroundColor = '#1D6154';
    }
});

//add form
document.querySelector("#btn_validate").addEventListener("click", async function (e) {
    if (e.target.id === "btn_validate") {
        const formreset = document.getElementById("forms_add_work")
        const titlework = document.querySelector('#titre1');
        const catego = document.querySelector("#cat")
        const imgads = document.querySelector("#imageUpload")
        const formData = new FormData();
        formData.append('image', imgads.files[0]);
        formData.append('title', titlework.value);
        formData.append('category', catego.value)
        const addnewwork = await fetch('http://localhost:5678/api/works',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData,
                mode: 'cors'
            }
        )
        if (addnewwork.status === 201) {
            document.querySelector('#messages').innerHTML = "Works ajoutés avec succes"
            exitmodal()
            if (formreset) {
                formreset.reset()
            }
            document.querySelector("#preview_img").style.display = 'none'
            document.querySelector(".fa-image").style.display = 'flex';
            document.querySelector(".image-info").style.display = 'flex';
            document.querySelector(".btn").style.display = 'flex';

        } else {
            document.querySelector('#messageserror').innerHTML = "Une erreur est survenue"
        }
    }
})

//add catégories to form
async function addcateform() {
    const catarray = await categories();
    catarray.forEach(element => {
        const formoption = document.createElement("option")
        formoption.setAttribute("label", element.name)
        formoption.setAttribute("value", element.id)
        document.querySelector('#cat').appendChild(formoption)
    })
}
addcateform()


///modal function to add work
document.querySelector('#adds').addEventListener("click", (e) => {
    projecthide.style.display = 'none'
    document.querySelector('#adds').style.display = 'none'
    document.querySelector('#forms_add_work').style.display = 'flex'
    document.querySelector("#btn_validate").style.display = 'flex'
    document.querySelector("#back").style.display = 'flex'
    document.querySelector("#title_modal").textContent = "Ajout photo"
})

function accueil(){
    const editheader = document.querySelector('#editionmod')
    const editpen = document.querySelector('#pen_tomodyfi')
    const login = document.querySelector('#login_page')
    if (localStorage.getItem('tok') === null) {
        editheader.style.display = 'none'
        editpen.style.display = 'none'
        login.textContent = "login"
    }
}
accueil()

function userpage(){
    const editheader = document.querySelector('#editionmod')
    const editpen = document.querySelector('#pen_tomodyfi')
    const filter = document.querySelector('#filer')    
    const login = document.querySelector('#login_page')
    if (localStorage.getItem('tok') !== null) {
        editheader.style.display = 'true'
        editpen.style.display = 'true'
        filter.style.display = 'none'
        login.textContent = "logout"   
    }
}
userpage()

document.querySelector("#login_page").addEventListener("click", (e) => {
    const login = document.querySelector('#login_page')
    if(login.textContent === "logout"){
        localStorage.removeItem("tok")
        location.href = "http://127.0.0.1:5500/"              
    }   
})
