const urlBase = 'https://jsonplaceholder.typicode.com/posts' // URL de la API con la que interactuaremos.
let posts = [] // Array vacío para almacenar los posts obtenidos de la API.

// Función para obtener datos de la API y almacenar los posts en el array 'posts'.
function getData() {
    fetch(urlBase) // Llamada a la API.
        .then(res => res.json()) // Convertimos la respuesta en un JSON.
        .then(data => {
            posts = data // Guardamos los datos en el array 'posts'.
            renderPostList() // Renderizamos la lista de posts en el DOM.
        })
        .catch(error => console.error('error when calling apii : ', error)) // Capturamos errores en la petición.
}

// Llamada inicial para obtener y mostrar los datos.
getData()


// Función para renderizar la lista de posts en el DOM.
function renderPostList() {
    const postList = document.getElementById('postList'); // Elemento HTML donde mostraremos los posts.
    postList.innerHTML = ''; // Limpiamos el contenido previo.

    // Recorremos el array 'posts' para crear y mostrar cada post.
    posts.forEach(post => {
        const listItem = document.createElement('li'); // Creamos un elemento de lista para cada post.
        listItem.classList.add('postItem'); // Asignamos una clase para estilos CSS.
        listItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})">Edit</button> 
            <button onclick="deletePost(${post.id})">Delete</button> 
            <div id="editForm-${post.id}" class="editForm" style="display:none">
                <label for="editTitle">Title: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <label for="editBody"> Commentary: </label>
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>
                <button onclick="updatePost(${post.id})"> Update </button>  
            </div>
        `
        postList.appendChild(listItem) // Agregamos el post a la lista.
    })
}

// Función para agregar un nuevo post enviando datos a la API.
function postData() {
    const postTitleInput = document.getElementById('postTitle'); // Elemento input para el título.
    const postBodyInput = document.getElementById('postBody'); // Elemento input para el cuerpo.
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() == '' || postBody.trim() == '') { // Validación para evitar inputs vacíos.
        alert('this field is required')
        return // Detenemos la ejecución si hay campos vacíos.
    }

    // Enviamos una solicitud POST a la API con los datos del nuevo post.
    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1, // ID de usuario ficticio.
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON.
        .then(data => {
            posts.unshift(data) // Añadimos el nuevo post al inicio del array 'posts'.
            renderPostList(); // Renderizamos la lista actualizada de posts.
            postTitleInput.value = '' // Limpiamos el input del título.
            postBodyInput.value = '' // Limpiamos el input del cuerpo.
        })
        .catch(error => console.error('error when trying to create the post: ', error)) // Capturamos errores.
}

// Función para mostrar u ocultar el formulario de edición de un post.
function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
    // Cambia el estado de visibilidad: si está oculto, lo muestra; si está visible, lo oculta.
}

// Función para actualizar un post existente enviando datos a la API.
function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value; // Nuevo título del post.
    const editBody = document.getElementById(`editBody-${id}`).value; // Nuevo cuerpo del post.

    // Enviamos una solicitud PUT a la API con los datos actualizados.
    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON.
        .then(data => {
            const index = posts.findIndex(post => post.id === data.id) // Buscamos el índice del post actualizado.
            if (index != -1) {
                posts[index] = data // Actualizamos el post en el array 'posts'.
            } else {
                alert('There was an error when trying to update the post information') // Error si no se encuentra el post.
            }
            renderPostList() // Renderizamos la lista actualizada de posts.
        })
        .catch(error => console.error('Error when trying to update the post: ', error)) // Capturamos errores.
}

// Función para eliminar un post enviando una solicitud DELETE a la API.
function deletePost(id) {
    fetch(`${urlBase}/${id}`, { // Solicitamos eliminar el post mediante su ID.
        method: 'DELETE',
    })
        .then(res => {
            if (res.ok) { // Verificamos si la respuesta fue exitosa.
                posts = posts.filter(post => post.id != id) // Filtramos el post eliminado del array.
                renderPostList(); // Renderizamos la lista actualizada.
            } else {
                alert('Error when trying to delete the post') // Mensaje de error si falla la eliminación.
            }
        })
        .catch(error => console.error('An error has occurred: ', error)) // Capturamos errores.
}

