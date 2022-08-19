// project-stats


// account for downloads prior ~02/2022
// (before PMC merge)
const downloads_accounted = {
    'lava-rising': 7171,
    'void-rising': 1575,
    'simple-dark': 1136,
    'uhc': 791,
    'water-rising': 781,
    'metro-dark-theme': 476,
    'opendyslexic-font': 328,
    'infection': 135,
    'vip': 67,
    'haunting-hunters': 80
}
let repos = [];

load_stats();


function load_stats() {
    document.getElementById('stats').innerHTML = '';

    let xhr = new XMLHttpRequest();
    let url = `https://api.github.com/orgs/plex1on/repos?sort=pushed&per_page=100`;
    xhr.open('GET',url,true);

    xhr.onload = function() {
        if (xhr.status == 403) {
            document.getElementById('stats').innerHTML = '<blockquote><strong>ERROR:</strong> reached API rate limit, <a href="https://plexion.dev/library/rates" target="_blank">view rate limit</a>.</blockquote>';
        } else {
            let data = JSON.parse(this.response);

            for (let i in data) {
                for (let t in data[i].topics) {
                    let topic = data[i].topics[t];
                    if (topic == 'datapack' || topic == 'resourcepack' || topic == 'map' || topic == 'event') {
                        get_stats(data[i].name);
                    }
                }
            }

            display();
        }
    }

    xhr.send();
}

function get_stats(name) {
    repos.push(name);

    let repo_xhr = new XMLHttpRequest();
    let repo_url = `https://api.github.com/repos/plex1on/${name}/releases`;
    repo_xhr.open('GET',repo_url,true);

    repo_xhr.onload = function() {
        let data = JSON.parse(this.response);
        let release_downloads = 0;
        for (let i in data) {
            for (let n in data[i].assets) {
                release_downloads += data[i].assets[n].download_count;
            }
            // check releases prior ~02/2022
            // (before PMC merge)
            if (name.toUpperCase() in downloads_accounted) {
                release_downloads += downloads_accounted[name.toUpperCase()];
            }
    
            localStorage.setItem(`${name}_stats`,release_downloads);
        }
    }

    repo_xhr.send();
}

function display() {
    let em_ul = document.createElement('ul');
    let total = 0;

    for (let i in repos) {
        let em_li = document.createElement('li');
        em_li.innerHTML = `<a href="https://github.com/plex1on/${repos[i]}" target="_blank">${repos[i]}</a>: <strong>${localStorage.getItem(`${repos[i]}_stats`)}</strong>`;

        total += parseInt(localStorage.getItem(`${repos[i]}_stats`));

        em_ul.appendChild(em_li);
    }

    document.getElementById('stats').appendChild(em_ul);

    // total
    let em_total = document.createElement('p');
    em_total.innerHTML = `total: <strong>${total}</strong>`;

    document.getElementById('stats').appendChild(em_total);
}