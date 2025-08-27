document.addEventListener('DOMContentLoaded', function() {
    const userCountInput = document.getElementById('userCount');
    const nameTypeSelector = document.getElementById('nameTypeSelector');
    const usersList = document.getElementById('usersList');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    
    let currentUsers = []; 
    let nameType = 'first'; 
    let timeoutId = null; 
    
    
    nameTypeSelector.addEventListener('change', function() {
        nameType = this.value;
        displayUsers(currentUsers); 
    });
    
    
    userCountInput.addEventListener('input', function() {
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        
        timeoutId = setTimeout(() => {
            if (this.value < 0) this.value = 0;
            if (this.value > 1000) this.value = 1000;
            generateUsers();
        }, 1500);
    });
    
    function generateUsers() {
        const userCount = parseInt(userCountInput.value);
        
        if (isNaN(userCount) || userCount < 0 || userCount > 1000) {
            showError('Please enter a valid number between 0 and 1000');
            return;
        }
        
        if (userCount === 0) {
            usersList.innerHTML = '';
            currentUsers = [];
            hideError();
            return;
        }
        
        
        if (userCount !== currentUsers.length) {
            hideError();
            showLoading();
            
            fetchUsers(userCount)
                .then(users => {
                    currentUsers = users; 
                    displayUsers(currentUsers);
                    hideLoading();
                })
                .catch(error => {
                    hideLoading();
                    showError(error.message);
                });
        }
    }
    
    function fetchUsers(count) {
        return new Promise((resolve, reject) => {
        
            const timeout = setTimeout(() => {
                reject(new Error('Request timeout. Please check your internet connection.'));
            }, 10000);
            
            fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au`)
                .then(response => {
                    clearTimeout(timeout);
                    
                    if (!response.ok) {
                        throw new Error(`API responded with status ${response.status}`);
                    }
                    
                    return response.json();
                })
                .then(data => {
                    resolve(data.results);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    function displayUsers(users) {
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const name = nameType === 'first' 
                ? `${user.name.first}` 
                : `${user.name.last}`;
            
            const userEl = document.createElement('div');
            userEl.className = 'user-row';
            
            userEl.innerHTML = `
                <div>${name}</div>
                <div>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</div>
                <div>${user.email}</div>
                <div>${user.location.country}</div>
            `;
            usersList.appendChild(userEl);
        });
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
    }
    
    function hideError() {
        errorMessage.classList.add('d-none');
    }
    
    function showLoading() {
        loading.classList.remove('d-none');
    }
    
    function hideLoading() {
        loading.classList.add('d-none');
    }
    
    generateUsers();
});