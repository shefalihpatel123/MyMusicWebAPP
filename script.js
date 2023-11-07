

let now_playing = document.querySelector('.now_playing');
let Music_art = document.querySelector('.music_image');
let Music_name = document.querySelector('.music_name');
let Music_artist = document.querySelector('.music_artist');
let playpause_btn = document.querySelector('.playpause_music');
let next_btn = document.querySelector('.next_music');
let prev_btn = document.querySelector('.prev_music');
let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current_time');
let total_duration = document.querySelector('.total_duration');
let curr_Music = document.createElement('audio');

let Music_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;
let itemData = [];
const music_list = [];

async function getMusicList(){
   await fetch('https://393d9bzbo6.execute-api.us-east-1.amazonaws.com/music')
    .then(response => response.json())
    .then(data => {
        console.log("==========API response========");
        console.log(data);
        itemData = data["Items"];
        music_list.length = 0; 
        console.log("==========Music Data========");
        console.log(itemData);
        itemData.forEach(item => {
            music_list.push(item);
           
        });
        loadMusic(Music_index);
    })
    .catch(error => console.log(error));
}
getMusicList();
function loadMusic(Music_index) {
   
    clearInterval(updateTimer);
    reset();

    curr_Music.src = music_list[Music_index].songUrl;
    curr_Music.load();

    Music_art.style.backgroundImage = "url(" + music_list[Music_index].imageUrl + ")";
    Music_name.textContent = music_list[Music_index].songName;
    Music_artist.textContent = music_list[Music_index].artistName;
    now_playing.textContent = "Song Playing " + (Music_index + 1) + " of " + music_list.length;
    updateTimer = setInterval(setUpdate, 1000);

    curr_Music.addEventListener('ended', nextMusic);
    document.body.style.background = "gray";
}

function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseMusic() {
    isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
    curr_Music.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseMusic() {
    curr_Music.pause();
    isPlaying = false;
    Music_art.classList.remove('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextMusic() {
    if (Music_index < music_list.length - 1 && isRandom === false) {
        Music_index += 1;
    } else if (Music_index < music_list.length - 1 && isRandom === true) {
        let random_index = Number.parseInt(Math.random() * music_list.length);
        Music_index = random_index;
    } else {
        Music_index = 0;
    }
    loadMusic(Music_index);
    playMusic();
}

function prevMusic() {
    if (Music_index > 0) {
        Music_index -= 1;
    } else {
        Music_index = music_list.length - 1;
    }
    loadMusic(Music_index);
    playMusic();
}

function seekTo() {
    let seekto = curr_Music.duration * (seek_slider.value / 100);
    curr_Music.currentTime = seekto;
}

function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(curr_Music.duration)) {
        seekPosition = curr_Music.currentTime * (100 / curr_Music.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_Music.currentTime / 60);
        let currentSeconds = Math.floor(curr_Music.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_Music.duration / 60);
        let durationSeconds = Math.floor(curr_Music.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

