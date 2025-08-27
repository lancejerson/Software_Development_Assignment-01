document.addEventListener('DOMContentLoaded', function() {
    const userCountInput = document.getElementById('userCount');
    const nameTypeSelect = document.getElementById('nameType');
    const usersTableBody = document.getElementById('usersTableBody');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    
    // Validate input range
    userCountInput.addEventListener('change', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 1000) this.value = 1000;
        generateUsers();
    });
    
    // Generate users when name type is changed
    nameTypeSelect.addEventListener('change', generateUsers);
    
    function generateUsers() {
        const userCount = parseInt(userCountInput.value);
        
        if (isNaN(userCount) || userCount < 0 || userCount > 1000) {
            showError('Please enter a valid number between 0 and 1000');
            return;
        }
        
        if (userCount === 0) {
            usersTableBody.innerHTML = '';
            hideError();
            return;
        }
        
        hideError();
        showLoading();
        
        fetchUsers(userCount)
            .then(users => {
                displayUsers(users);
                hideLoading();
            })
            .catch(error => {
                hideLoading();
                showError(error.message);
            });
    }
    
    function fetchUsers(count) {
        return new Promise((resolve, reject) => {
            // Set a timeout for the API request
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
        const nameType = nameTypeSelect.value;
        usersTableBody.innerHTML = '';
        
        users.forEach(user => {
            const name = nameType === 'first' 
                ? `${user.name.first}` 
                : `${user.name.last}`;
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${name}</td>
                <td>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
                <td>${user.email}</td>
                <td>${user.location.country}</td>
            `;
            usersTableBody.appendChild(row);
        });
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    function showLoading() {
        loading.style.display = 'block';
        nameTypeSelect.disabled = true;
    }
    
    function hideLoading() {
        loading.style.display = 'none';
        nameTypeSelect.disabled = false;
    }
    
    const handleEnterKey = (e) => {
        if(e.key === 'Enter') {
            generateUsers();
        }
    }
    
    userCountInput.addEventListener('keydown', handleEnterKey);
    
    // Generate users on page load
    generateUsers();
});