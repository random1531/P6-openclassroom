const addfilterkshtml = document.querySelector("#filer");
const addworkshtml = document.querySelector("#portfolio .gallery");
let filterselector = document.querySelectorAll("#filer");
const arrayworksss = document.querySelector(".modal__project");
const token = localStorage.getItem('tok')
const addpicture = document.querySelector('.formaddpicture')
const buttonadd = document.querySelector('#adds')
const projecthide = document.querySelector(".modal__project")
const modalactiv = document.querySelector('#modal__block');


async function works() {
    const initworks = await fetch("http://localhost:5678/api/works");
    return await initworks.json();
}
works()

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



///modal function

document.querySelector('#adds').addEventListener("click", (e) => {
    projecthide.style.display = 'none'
    document.querySelector('#adds').style.display = 'none'
    document.querySelector('#forms_add_work').style.display = 'flex'
   
})

document.querySelector('.fa-pen-to-square').addEventListener("click", (e) => {
    modalactiv.style.display = 'flex';
})
document.querySelector('.fa-xmark').addEventListener("click", (e) => {
    modalactiv.style.display = 'none';
})
document.querySelector('#modal__block').addEventListener("click", (e) => {
    console.log(e.target.id)
    if (e.target.id === 'modal__block') {
        modalactiv.style.display = 'none';
    }

})

//modal project picture import
const image = document.querySelector('.modal__project')

async function picturemodal() {
    const arrayworkss = await works();
    console.log(arrayworkss)
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
        const deleted = await fetch('http://localhost:5678/api/works/' + e.target.id, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer' + " " + token
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

const updateimg = document.querySelector("#preview_img")
document.getElementById('imageUpload').addEventListener('change', function (e) {
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


document.querySelector("#btn_validate").addEventListener("click", async function (e) {
    if (e.target.id === "btn_validate") {
        const titlework = document.querySelector('#titre1');
        const catego = document.querySelector("#cat")
        const imgads = document.querySelector("#imageUpload")

        const formData = new FormData();

        formData.append('image', imgads.files[0]);
        formData.append('title', titlework.value);
        formData.append('category', 1)

        const addnewwork = await fetch('http://localhost:5678/api/works',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer' + " " + token
                },
                body: formData,
            }
        )
        if (addnewwork.status === 201) {
            console.log(titlework.value)
            document.querySelector('#message').innerHTML = "Works ajoutés avec succes"
            // document.querySelector("#imgads")
        } else {
            console.log("echec")
        }
    }

})

