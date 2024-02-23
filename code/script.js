
let currentSong = new Audio();
let CurrentFolder;
let songs;
const Play = document.querySelector("#play");


function SecondsToMinutes(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  return formattedMinutes + ':' + formattedSeconds;
}

var seconds = 123.456;




async function GetTheSong(folder) {


  const a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  CurrentFolder = folder
  const response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  const as = div.getElementsByTagName("a")
  songs = []

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  const SongUl = document.querySelector(".scroll").querySelector("ul")
  SongUl.innerHTML = ""
  for (const Songtitle of songs) {

    let li = document.createElement("li")
    li.classList.add("li")
    const CLeanSongTitle = Songtitle.replaceAll("%20", " ").split(".")[0]
   
    li.innerHTML = ` 

  <div class="MusicLogoAndName flex gap itemsCenter">
      <i class="fa-solid fa-music"></i>
      <div class="Sname">
          <p>${CLeanSongTitle}</p>
         
      </div>
  </div>
  <div class="playMusic flex gap itemsCenter">
      <p>Play Music</p>
      <i class="fa-regular fa-circle-play"></i>
  </div>
`
    SongUl.append(li)

  }

  document.querySelectorAll(".li").forEach((li) => {
    li.addEventListener("click", (e) => {
      document.querySelector(".left").style.left = "-125%"

      const SongName = e.currentTarget.querySelector(".Sname").getElementsByTagName("p")[0].innerHTML+".mp3";

      PLAYSong(SongName)
    })
    
  })
  return songs
}





function PLAYSong(Song, pause = false) {

  currentSong.src = `/${CurrentFolder}/` + Song
  if (!pause) {
    currentSong.play()
    Play.classList.remove("fa-circle-play")
    Play.classList.add("fa-circle-pause")
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(Song).split(".")[0]
  document.querySelector(".SongTime").innerHTML = "00:00 / 00:00"

  DisplayAlbum()
}



async function DisplayAlbum() {
  const cardContainer = document.querySelector(".cardsItem");
  const a = await fetch(`http://127.0.0.1:5500/Songs/`);
  const response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
cardContainer.innerHTML=""
  for (let i = 0; i < array.length; i++) {
      const e = array[i];

      if (e.href.includes("/Songs/")) {
          let folders = e.href.split("/").slice(-1)[0];
          const a = await fetch(`http://127.0.0.1:5500/Songs/${folders}/info.json`);
          const response = await a.json();
         

          cardContainer.innerHTML =
              cardContainer.innerHTML +
              `
              <div class="card" data-folder=${folders}>
                  <i class="fa-solid fa-circle-play"></i>
                  <img src="/Songs/${folders}/Cover.jpeg" alt="">
                  <h3>${response.title}</h3>
                  <p>${response.description}</p>
              </div>
          `;
      }
  }

  

  document.querySelectorAll(".card").forEach((cards) => {

    cards.addEventListener("click", async (e) => {
      songs = await GetTheSong(`Songs/${e.currentTarget.dataset.folder}`);
  
      document.querySelector(".left").style.left = "0%";
      
      document.querySelector(".cross").addEventListener("click", () => {
          document.querySelector(".left").style.left = "-125%";
      });
  
      await PLAYSong(songs[0]);
  });

  });
}




async function main() {

  await GetTheSong("Songs/AnuvJain")
  PLAYSong(songs[0], true)


  Play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      Play.classList.remove("fa-circle-play")
      Play.classList.add("fa-circle-pause")

    }
    else {
      currentSong.pause()
      Play.classList.remove("fa-circle-pause")
      Play.classList.add("fa-circle-play")
    }

  })

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".SongTime").innerHTML = `${SecondsToMinutes(currentSong.currentTime)} / ${SecondsToMinutes(currentSong.duration)}`
    document.querySelector(".circle").style.left = `${currentSong.currentTime / currentSong.duration * 100}%`;

  })


  document.querySelector(".Seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

}


// setting left on mobiles
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0%"
})

document.querySelector(".cross").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-125%"

})

// Attaching event on previous and next button
document.querySelector(".previous").addEventListener("click", () => {

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

  if ((index - 1) >= 0)

    PLAYSong(songs[index - 1])

})

document.querySelector(".next").addEventListener("click", () => {

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if ((index + 1) < songs.length)
    PLAYSong(songs[index + 1])

})



const volumeInput = document.querySelector(".Volume input");
volumeInput.addEventListener("change", () => {

  currentSong.volume = volumeInput.value / 100
  const VolIcon = document.querySelector(".volicon")

  if (currentSong.volume == 0.0) {
    VolIcon.classList.add("fa-volume-xmark")
    VolIcon.classList.remove("fa-volume-high")
  }
  else {
    VolIcon.classList.add("fa-volume-high")
    VolIcon.classList.remove("fa-volume-xmark")
  }


});






main()
