const BASE_URL = 'https://book-directory-api.herokuapp.com/apis';
let token;

const signUpForm = document.getElementById('sign_up')
const signInForm = document.getElementById('sign_in')
const getBooksForm = document.getElementById('get_books')
const getBookByIdForm = document.getElementById('get_book_by_id')
const addBookForm = document.getElementById('add_book')
const updateBookForm = document.getElementById('update_book')
const deleteBookForm = document.getElementById('delete_book')

const requestData = document.getElementById('request')
const responseData = document.getElementById('response')
// var genreOptions = document.getElementsByName('genreOptions');
// var UpdateGenreOptions = document.getElementsByName('UpdateGenreOptions');

signUpForm.addEventListener('submit', event => {
    event.preventDefault()
    signUp(this)
})

signInForm.addEventListener('submit', event => {
    event.preventDefault()
    signIn(this)
})

getBooksForm.addEventListener('submit', event => {
  event.preventDefault()
  getBooks(this)
})

getBookByIdForm.addEventListener('submit', event => {
    event.preventDefault()
    getBookById(this)
})

addBookForm.addEventListener('submit', event => {
    event.preventDefault()
    addBook(this)
})

updateBookForm.addEventListener('submit', event => {
    event.preventDefault()
    updateBook(this)
})

deleteBookForm.addEventListener('submit', event => {
    event.preventDefault()
    deleteBook(this)
})


const splitRequestResponse = (response) => {
    const responseData = response.data;
    console.log(response);
    const requestData = {}
    requestData.method = response.config.method
    requestData.url = response.config.url
    requestData.headers = response.config.headers
    requestData.data = response.config.data

    return [responseData, requestData]
}

const signUp = async (form) => {
    // console.log(form.elements)

    const params = new URLSearchParams();
    params.append('name', form.sign_up_name.value);
    params.append('email', form.sign_up_email.value);
    params.append('password', form.sign_up_password.value);

    try {
        const data = await axios.post(`${BASE_URL}/users/signup`, params);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        console.error(errors);
        displayResponse(errors)
        displayRequest({})
    }
};

const signIn = async (form) => {
    // console.log(form.elements)
    const params = new URLSearchParams();
    params.append('email', form.sign_in_email.value);
    params.append('password', form.sign_in_password.value);
    
    try {
        const data = await axios.post(`${BASE_URL}/users/signin`, params);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        localStorage.setItem('token', response.token);
        token = response.token
        // setToken()

        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        console.error(errors);
        displayResponse(errors)
        displayRequest({})
    }
};

const getBooks = async (form) => {
    let query = ""
    const radio = document.querySelector('input[name="getGenreOptions"]:checked')
    const title = form.get_title.value
    const author = form.get_author.value
    const genre = radio != null ? radio.value : null
    const publication_year = form.get_publication_year.value
    if(title || author || genre || publication_year) {
        query += "?"
        if(title) query += (`title=${title}`)
        if(author) {
            if(query == "?") query += (`author=${author}`)
            else query += (`&author=${author}`)
        }
        if(genre) {
            if(query == "?") query += (`genre=${genre}`)
            else query += (`&genre=${genre}`)
        }
        if(publication_year) {
            if(query == "?") query += (`publication_year=${publication_year}`)
            else query += (`&publication_year=${publication_year}`)
        }
    }

    try {
        // console.log(query)

        const data = await axios.get(`${BASE_URL}/books/all${query}`);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        const [response, request] = errorMessage(errors)
        
        // console.error(errors);
        displayResponse(response)
        displayRequest(request)
    }
};

const getBookById = async (form) => {
    try {
        const data = await axios.get(`${BASE_URL}/books/${form.get_id.value}`);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        const [response, request] = errorMessage(errors)
        
        // console.error(errors);
        displayResponse(response)
        displayRequest(request)
    }
};

const addBook = async (form) => {
    // console.log(form.elements)
    genreOptions = ""
    try { genreOptions = document.querySelector('input[name="genreOptions"]:checked').value }
    catch {}
    finally {}

    const params = new URLSearchParams();
    params.append('title', form.add_title.value);
    params.append('author', form.add_author.value);
    params.append('genre', genreOptions);
    params.append('publication_year', Number.parseInt(form.add_publication_year.value));
    params.append('abstract', form.add_abstract.value);

    try {
        setToken()
        const data = await axios.post(`${BASE_URL}/books/create`, params);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        const [response, request] = errorMessage(errors)
        
        // console.error(errors);
        displayResponse(response)
        displayRequest(request)
    }
};

const updateBook = async (form) => {
    // console.log(form.elements)
    updateGenreOptions = ""
    try { updateGenreOptions = document.querySelector('input[name="updateGenreOptions"]:checked').value }
    catch {}
    finally {}

    const params = new URLSearchParams();
    if(form.update_title.value) params.append('title', form.update_title.value);
    if(form.update_author.value) params.append('author', form.update_author.value);
    if(updateGenreOptions) params.append('genre', updateGenreOptions);
    if(form.update_publication_year.value) params.append('publication_year', Number.parseInt(form.update_publication_year.value));
    if(form.update_abstract.value) params.append('abstract', form.update_abstract.value);

    try {
        setToken()
        const data = await axios.post(`${BASE_URL}/books/${form.update_id.value}/update`, params);
        // console.log(data)
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        const [response, request] = errorMessage(errors)
        
        // console.error(errors);
        displayResponse(response)
        displayRequest(request)
    }
};

const deleteBook = async (form) => {
    try {
        setToken()
        const data = await axios.post(`${BASE_URL}/books/${form.delete_id.value}/delete`);
        const [response, request] = splitRequestResponse(data)
        displayResponse(response)
        displayRequest(request)
    } catch (errors) {
        const [response, request] = errorMessage(errors)
        
        // console.error(errors);
        displayResponse(response)
        displayRequest(request)
    }
};

const displayResponse = (data) => {
    var jsonStr = JSON.stringify(data, undefined, 4)
    json = syntaxHighlight(jsonStr)
    responseData.innerHTML = json
}

const displayRequest = (data) => {
    var jsonStr = JSON.stringify(data, undefined, 4)
    json = syntaxHighlight(jsonStr)
    requestData.innerHTML = json
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

const errorMessage = (error) => {
    let request, response
    switch(error.status) {
        case 401:
            response = { message: "You are Unauthorized", status: error.status }
            break
        case 403:
            response = { message: "token invalid or expired", status: error.status }
            break
        default:
            response = { message: error.message, status: error.status }
    }

    request = { 
        url: error.config.url, 
        method: error.config.method,
        headers: error.config.headers, 
        data: error.config.data 
    }
    // console.log(response)
    return [ response, request ]
}

const setToken = () => {
    if(token != null) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

const init = () => {
    token = localStorage.getItem('token');
    // console.log(token)
}

init()