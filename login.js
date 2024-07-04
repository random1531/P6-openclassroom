
async function login() {
    const emailtext = document.querySelector('#email');
    const passwordtext = document.querySelector('#password');
    let body = {
        email: emailtext.value,
        password: passwordtext.value
    }

    body = JSON.stringify(body)

    const datalog = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body,

    })
    if (datalog.status === 200) {
        const data = await datalog.json()
        localStorage.setItem("tok", data.token)
        location.href = "http://127.0.0.1:5500/userpage.html"

    } else {
        document.querySelector('#errormessage').innerHTML = "Mauvais identifiant"
    }



} 