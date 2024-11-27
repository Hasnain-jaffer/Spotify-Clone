console.log("let write the javascript")
let currSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch (`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as =  div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class="invert" src="/images/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Rockstar</div>
                            </div>
                            <div class="playNow">
                                <span>Play now</span>
                                <img class="invert" src="/images/play.svg" alt="">
                            </div>
        </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    })

    return songs

}

const playMusic = (track, pause=false)=>{
    currSong.src = `/${currFolder}/` + track;
    if(!pause){
        currSong.play();
        play.src = "/images/pause.svg"
    }
    document.querySelector(".songsInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder)
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json(); 
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" width="150" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
          playMusic(songs[0])
        })
    })
    
}



async function main(){
    songs = await getSongs("songs/Album");
    playMusic(songs[0], true);

displayAlbums();
  
    play.addEventListener("click", ()=>{
        if(currSong.paused){
            currSong.play();
            play.src = "/images/pause.svg"
        } else{
            currSong.pause();
            play.src = "/images/play.svg"
        }
    })  
      currSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)} / ${secondsToMinutesSeconds(currSong.duration)}`
    document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
   })
   document.querySelector(".seekBar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = ((currSong.duration) * percent) / 100
})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"; 
})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-110%"; 
})
previous.addEventListener("click", () => {
    currSong.pause()
    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

next.addEventListener("click", () => {
    currSong.pause()
    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currSong.volume = parseInt(e.target.value)/100;
})

document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("/images/volume.svg")){
        e.target.src = e.target.src.replace("/images/volume.svg", "/images/mute.svg")
        currSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("/images/mute.svg", "/images/volume.svg")
        currSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})


}

main();


