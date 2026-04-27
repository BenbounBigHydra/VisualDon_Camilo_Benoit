const API_BASE = 'https://classical.perplexus.ch/api/v1';

const getUserUuid = () => {
    return JSON.parse(localStorage.getItem('user_uuid'));
}

const getAnswered = () => {
    return JSON.parse(localStorage.getItem('answered')) ?? [];
}

const addAnswered = (category) => {
    const answered = getAnswered();
    answered.push(category);
    localStorage.setItem('answered', answered);
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
export { API_BASE, getUserUuid, getUser, getAnswered, addAnswered };
