(() => {
    const app = {
        initialize() {
            this.cacheElements();
            this.getCurrentWeather();
            this.getDogTiles();
            this.getPGMTeam();
            this.searchOnClick();
            this.detailsOnClick();
        },
        cacheElements() {
            this.$weatherItem = document.querySelector('.weather-item');
            this.$dogsItem = document.querySelector('.dogs-item');
            this.$teamMembers = document.querySelector('.pgm-members');
            this.$submitbtn = document.querySelector('.submit-btn');
            this.$searchbar = document.querySelector('.searchbar');
            this.$usercontainer = document.querySelector('.users__container');
            this.$userbox = document.querySelector('.personal-info-box');
            this.$userRepositories = document.querySelector('.repositories-box');
            this.$userFollowers = document.querySelector('.followers-box');
        },
        async getCurrentWeather() {
            
            try {
                const response = await fetch("http://api.weatherapi.com/v1/current.json?key=acdd62ff08054cb9b2e111932222112&q=Ghent&aqi=no", {});
                if (response.status === 200) {
                    const data = await response.json();
                    this.$weatherItem.innerHTML =  
                    `
                    <p class="weather_temp">
                    ${data.current.temp_c}°C
                    </p>
                    <img src="${'http://' + data.current.condition.icon}" loading="lazy">
                    `;
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        async getDogTiles() {
            try {
                const response = await fetch("https://data.stad.gent/api/records/1.0/search/?dataset=hondentoilletten-gent&q=&rows=1000&facet=soort&facet=bestaand", {});
                if (response.status === 200) {
                    const data = await response.json();
                    this.$dogsItem.innerHTML = this.updateDogTiles(data);
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        updateDogTiles(data) {
            const filteredData = data.records.filter((record => {
                if(record.fields.soort == 'Anti-hondenpoeptegel') {
                    return record;
                }
            }))
            return `
            <p>anti-hondenpoeptegels: ${filteredData.length}</p>
            `
        },
        async getPGMTeam() {
            try {
                const response = await fetch("static/data/pgm.json", {});
                console.log(response);
                if (response.status === 200) {
                    const data = await response.json();
                    const htmlStr = this.updateTeamMembers(data);
                    this.$teamMembers.innerHTML = htmlStr;
                    
                } 
            } catch (error) {
                console.log(`Catch ${error}`);
            }
        },
        updateTeamMembers(data) {
            return data.map((member) => {
                return `
                <li>
                <a class="pgm-team-member" href="" data-email="${member.email}" data-username="${member.portfolio.github}">
                <img data-username="${member.portfolio.github}" src="${member.thumbnail}">
                <p data-username="${member.portfolio.github}" class="github">${member.portfolio.github}</p>
                <p data-username="${member.portfolio.github}" class="name">${member.voornaam} ${member.familienaam}</p>
                </a>
                </li>
                `
            }).join('');
        },
        searchOnClick() {
            this.$submitbtn.addEventListener('click',(event) => {
                this.getGithubUsers(this.$searchbar.value);
            }) 
        },
        async getGithubUsers(value) {
            try {
                const response = await fetch(`https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${value}`, {});
                if (response.status === 200) {
                    const data = await response.json();
                    this.updateGithubUsers(data);
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        updateGithubUsers(data) {
            const userList = data.items.map((user) => {
                return `
                    <div class="users_box" data-username="${user.login}">
                    <img src='${user.avatar_url}'>
                    <p>${user.login}</p>
                    </div>
                    `
            }).join('');
            this.$usercontainer.innerHTML = userList;
        },
        detailsOnClick() {
            document.addEventListener('click', (event) => {
                event.preventDefault();
                this.getSpecificUser(event.target.parentNode.dataset.username);
            })
        },
        async getSpecificUser(username) {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`, {});
                if(response.status === 200) {
                    const data = await response.json();
                    this.updateUserDetails(data);
                    this.getRepositories(username);
                    this.getFollowers(username);
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        updateUserDetails(user) {
            this.$userbox.innerHTML =
                `
                <div class="users_balk" data-username="${user.login}">
                <img src='${user.avatar_url}'>
                <p>${user.login}</p>
                </div>
                `;
        },
        async getRepositories(username) {
            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=50`, {});
                if(response.status === 200) {
                    const data = await response.json();
                    this.updateUserRepositories(data);
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        updateUserRepositories(repositories) {
            this.$userRepositories.innerHTML = repositories.slice(0, 10).map(repo => {
                return `
                <li>
                <h2>${repo.name}</h2>
                <p>${repo.description}</p>
                </li>
                `
            }).join('');
        },
        async getFollowers(username) {
            try {
                const response = await fetch(`https://api.github.com/users/${username}/followers?page=1&per_page=100`, {});
                if(response.status === 200) {
                    const data = await response.json();
                    this.updateUserFollowers(data);
                }
            } catch (error) {
                console.log(`Catch: ${error}`);
            }
        },
        updateUserFollowers(followers) {
            this.$userFollowers.innerHTML = followers.slice(0, 10).map(follower => {
                return `
                <li class="folower-card" data-username="${follower.login}">
                <img src='${follower.avatar_url}'>
                <p>${follower.login}</p>
                </li>
                `
            }).join('');
        },
    }
    app.initialize();
})();
