const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const radomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
let allSong = $$('.song');

const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Tâm sự với em',
            singer: 'NS Chiến Thắng',
            path: '../music/y2meta.com - Tâm sự với em ( Chiến thắng - N2X) (128 kbps).mp3',
            image: '../image/img10.jpg'
        },
        {
            name: 'Khi em lớn',
            singer: 'Orange x Hoàng Dũng',
            path: '../music/y2meta.com - KHI EM LỚN (Frexs Remix) HOT TREND TIKTOK 2022 - Orange x Hoàng Dũng _ EM SẼ NGÃ ĐAU HƠN BÂY GIỜ (128 kbps).mp3',
            image: '../image/img02.jpg'
        },
        {
            name: 'Gái Độc Thân',
            singer: 'tlinh x AnhVu',
            path: '../music/y2meta.com - Gái Độc Thân - tlinh x AnhVu「Remix Version by 1 9 6 7」_ Audio Lyrics Video (128 kbps).mp3',
            image: '../image/img04.jpg'
        },
        {
            name: 'Lý do là gì',
            singer: 'Thái Học Cover',
            path: '../music/y2meta.com - LÝ DO LÀ GÌ (AIR REMIX) - NGUYỄN VĨ _ LỤC TÌM NHỮNG KÝ ỨC ANH THẤY LÒNG MÌNH NGHẸN NGÀO TIKTOK (128 kbps).mp3',
            image: '../image/img03.jpg'
        },
        {
            name: '2AM',
            singer: 'DBEOS REMIX',
            path: '../music/y2meta.com - 2AM REMIX DBEOS REMIX - ANH TRÔNG THEO ĐÓ ĐÂY NHƯNG SAO CHẲNG THẤY REMIX EM NÓI EM SẼ VỀ ĐÂY KHI MÙA (128 kbps).mp3',
            image: '../image/img05.jpg'
        },
        {
            name: 'Good Boy',
            singer: 'GD X TAEYANG',
            path: '../music/y2meta.com - Hot Raz Nhạc_ Nhạc Chơi Liên Quân _ Nhạc phim Raz _ Liên Quân Raz ep.2 _ MagieYue Nhạc (128 kbps).mp3',
            image: '../image/img08.jpg'
        },
        {
            name: 'Đoạn Tuyệt Nàng Đi Beat',
            singer: 'Nhạc Nền Florentino, Tesla',
            path: '../music/y2meta.com - Beat Đoạn Tuyệt Nàng Đi Ver2 Remix - Nhạc Nền Florentino, Tesla Không Lời Hot TikTok 2022 (128 kbps).mp3',
            image: '../image/img01.jpg'
        },
        {
            name: 'Nothing On You',
            singer: 'Barry Brizzy',
            path: '../music/y2meta.com - Nothing On You - Barry Brizzy __ (Vietsub + Lyric) (128 kbps).mp3',
            image: '../image/img06.jpg'
        },
        {
            name: 'Animals',
            singer: 'Maroon 5',
            path: '../music/y2meta.com - Maroon 5 - Animals (Lyrics) (128 kbps).mp3',
            image: '../image/img07.jpg'
        },
        {
            name: 'Industry Baby vs. E.T. (Mashup)',
            singer: 'Lil Nas X, Katy Perry',
            path: '../music/y2meta.com - Lil Nas X, Katy Perry - Industry Baby vs. E.T. (Mashup) (128 kbps).mp3',
            image: '../image/img09.jpg'
        }
    ],
    handleEvents() {
        const cdWidth = cd.clientWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        };

        playBtn.onclick = function () {
            player.classList.toggle('playing')
            if (player.classList.contains('playing')) {
                audio.play()
                cdThumbAnimate.play()
            } else {
                audio.pause()
                cdThumbAnimate.pause()
            }
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            this.repeatSong()
            this.RadomSong()
        }

        progress.oninput = function (e) {
            audio.currentTime = e.target.value / 100 * audio.duration
        }

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        nextBtn.onclick = () => {
            this.nextSong()
            audio.play()
            if (player.classList.contains('playing') === false) {
                player.classList.add('playing')
            }
            this.activeSong()
            this.RadomSong()
            this.scrollActive()
        }

        prevBtn.onclick = () => {
            this.prevSong()
            audio.play()
            if (player.classList.contains('playing') === false) {
                player.classList.add('playing')
            }
            this.RadomSong()
            this.activeSong()
            this.scrollActive()
        }

        radomBtn.onclick = () => {
            radomBtn.classList.toggle('active')
            this.RadomSong()
        }

        repeatBtn.onclick = () => {
            repeatBtn.classList.toggle('active')
        }

        playlist.onclick = (e) => {
            const clickSong = e.target.closest('.song:not(.active)')
            if (clickSong || e.target.closest('.option')) {
                if (clickSong) {
                    allSong.forEach(item => item.classList.remove('active'))
                    clickSong.classList.add('active')
                    player.classList.add('playing')
                    this.currentIndex = clickSong.dataset.index
                    this.loadCurrentSong()
                    audio.play()
                    cdThumbAnimate.play()
                } else if (e.target.closest('.option')) {
                    alert('Chức năng chưa hoàn thiện !!!')
                }
            }
        }
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: () => this.songs[this.currentIndex]
        })
    },
    activeSong() {
        allSong = $$('.song')
        this.songs.forEach((song, index) => {
            song.id = index
            if (song.id === this.currentIndex) {
                allSong.forEach(item => item.classList.remove('active'))
                allSong[index].classList.add('active')
            }
        })
        this.scrollActive()
    },
    scrollActive() {
        const songActive = $('.song.active')
        document.documentElement.scrollTop = songActive.offsetTop - 200
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    RadomSong() {
        if (radomBtn.classList.contains('active')) {
            if (audio.ended || audio.ended === false) {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while (this.currentIndex === newIndex)
                this.currentIndex = newIndex;
            }
        }
    },
    repeatSong() {
        if (repeatBtn.classList.contains('active')) {
            if (audio.ended) {
                audio.play()
            }
        } else {
            if (audio.ended) {
                this.nextSong()
                audio.play()
            }
        }
    },
    render() {
        let stringSongs = this.songs.map((song, index) => {
            return `<div class="song" data-index=${index}>
            <div class="thumb"
                style="background-image: url(${song.image})">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        });
        playlist.innerHTML = stringSongs.join('')
    },
    starts() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        this.activeSong()
        this.scrollActive()
    }
}

app.starts()