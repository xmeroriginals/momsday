document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const momName =
        urlParams.get("customname") || "Anneler Günün Kutlu Olsun Annem!";
    const customNote =
        urlParams.get("customnote") ||
        "Her şeyim olan Annem’e, Anneler Günün Kutlu Olsun Annem...";

    document.getElementById("momGreeting").textContent = `${momName}`;
    document.getElementById("customnote").textContent = customNote;
    const musicToggle = document.getElementById("musicToggle");
    const bgMusic = document.getElementById("bgMusic");
    let musicPlaying = false;

    musicToggle.addEventListener("click", function () {
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicPlaying = false;
        } else {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicPlaying = true;
        }
    });
    const scrollElements = document.querySelectorAll("[data-scroll]");
    const navDots = document.querySelectorAll(".nav-dot");

    const elementInView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / 1.2
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
        const scrollPosition = window.scrollY;

        document.querySelectorAll("section[id]").forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");
            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                navDots.forEach((dot) => {
                    dot.classList.remove("active");
                    if (dot.getAttribute("data-section") === sectionId) {
                        dot.classList.add("active");
                    }
                });
            }
        });
    };

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
    handleScrollAnimation();
    navDots.forEach((dot) => {
        dot.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });
    const gameBoard = document.getElementById("gameBoard");
    const movesDisplay = document.getElementById("moves");
    const pairsDisplay = document.getElementById("pairs");
    const timeDisplay = document.getElementById("time");
    const restartGameBtn = document.getElementById("restartGame");
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let pairsFound = 0;
    let timer;
    let seconds = 0;
    let gameStarted = false;
    const emojis = ["🌸", "🌺", "🌷", "🌹", "💐", "🌻", "🌼", "🏵️"];
    function initGame() {
        moves = 0;
        pairsFound = 0;
        seconds = 0;
        gameStarted = false;
        updateStats();
        gameBoard.innerHTML = "";
        cards = [...emojis, ...emojis];
        shuffleCards();

        cards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("game-card");
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = `<span style="opacity: 0;">${emoji}</span>`;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
        clearInterval(timer);
        timeDisplay.textContent = "0";
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (!gameStarted) {
            gameStarted = true;
            timer = setInterval(updateTimer, 1000);
        }
        this.classList.add("flipped");
        this.querySelector("span").style.opacity = "1";

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        moves++;
        updateStats();
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        if (isMatch) {
            disableCards();
            pairsFound++;
            updateStats();

            if (pairsFound === emojis.length) {
                clearInterval(timer);
                setTimeout(() => {
                    Swal.fire({
                        title: "Tebrikler",
                        text: `Tebrikler! Oyunu ${moves} hamlede ve ${seconds} saniyede tamamladınız!`,
                        icon: "success",
                    });
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.querySelector("span").style.opacity = "0";
            secondCard.querySelector("span").style.opacity = "0";

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateStats() {
        movesDisplay.textContent = moves;
        pairsDisplay.textContent = pairsFound;
    }

    function updateTimer() {
        seconds++;
        timeDisplay.textContent = seconds;
    }
    restartGameBtn.addEventListener("click", initGame);
    initGame();
});
