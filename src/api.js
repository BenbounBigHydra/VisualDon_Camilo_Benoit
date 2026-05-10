// const API_BASE = 'https://api.classical.perplexus.ch/api/v1';
const API_BASE = 'http://localhost:8000/api/v1';

const getUserUuid = () => {
    return JSON.parse(localStorage.getItem('user_uuid'));
}

const getAnswered = () => {
    return JSON.parse(localStorage.getItem('answered')) ?? [];
}

const addAnswered = (category) => {
    const answered = getAnswered();
    answered.push(category);
    localStorage.setItem('answered', JSON.stringify(answered));
}

const checkResultAccess = async () => {
    const canAccessResults = JSON.parse(localStorage.getItem('can_access_results')) === 'true';

    if (canAccessResults) {
        return true;
    } else {
        const user = await getUser();
        if (user['listened_titles'].length >= 10) {
            localStorage.setItem('can_access_results', 'true');
            return true;
        } else {
            return false;
        }
    }
}

const getData = async (endpoint) => {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    let data = await res.json();
    
    return data;
}

const getUser = async () => {
    const userUuid = getUserUuid();
    const res = await fetch(`${API_BASE}/users/self`, {
        headers: {
            "Accept" : "application/json",
            "Authorization" : `UUID ${userUuid}`
        }
    })
    const data = await res.json();
    return data;
}

const getComposers = async () => {
    const res = await fetch(`${API_BASE}/composers`, {
        headers: {
            "Accept" : "application/json",
        }
    })
    const data = await res.json();
    return data;
}

const getTitle = async (id) => {
    const res = await fetch(`${API_BASE}/titles/${id}`, {
        headers: {
            "Accept" : "application/json",
        }
    })
    const data = await res.json();
    return data;
}

const getTitles = async () => {
    const res = await fetch(`${API_BASE}/titles`, {
        headers: {
            "Accept" : "application/json",
        }
    })
    const data = await res.json();
    return data;
}

const sendForm = async (form, endpoint) => {
    const formData = new FormData(form);
    // console.log(form, formData);
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
            "Accept" : "application/json",
            "Authorization" : `UUID ${getUserUuid()}`
        }
    });
    const data = await res.json();
    return data;
}

const getStats = async (endpoint, id) => {
    const res = await fetch(`${API_BASE}/${endpoint}/stats`, {
        headers: {
            "Accept" : "application/json"
        }
    });
    const data = await res.json();
    return data;
}

const composers = await getComposers();
const titles = await getTitles();

export { API_BASE, getUserUuid, getUser, getAnswered, addAnswered, sendForm, getComposers, getTitles, getTitle, composers, titles, getStats, checkResultAccess, getData };
