const API_BASE = 'https://classical.perplexus.ch/api/v1';

const getUserUuid = () => {
    return JSON.parse(localStorage.getItem('user_uuid'));
}
export { API_BASE, getUserUuid };
