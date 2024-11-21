document.addEventListener("DOMContentLoaded", function () {
    let images = ["img/malyna.png", "img/apple.png", "img/blue.png", "img/banana.png", "img/orange.png"];
    let userName = prompt("Введіть своє ім'я:") || "Користувач";
    let balance = 1000;
    let attempts = 0;
    let spins = 0;
    let maxAttempts = 3;
    let debt = false;

    document.getElementById("userName").textContent = userName;
    updateAttempts();
    updateBalance();

    let generateButton = document.getElementById("generateButton");
    let restartButton = document.getElementById("restartButton");

    generateButton.addEventListener("click", function () {
        if (attempts < maxAttempts && balance >= 100) {
            attempts++;
            spins++;
            if (spins % 3 === 0) {
                setTimeout(() => {
                balance -= 100;
                updateBalance();
                 document.getElementById("resultMessage").textContent = 
                    "На жаль, - 100 грн. Наступного разу пощастить!";
            }, 1000);
         } else {
                document.getElementById("resultMessage").textContent = "";
            }
            
            updateAttempts();
            startScroll();
        } else if (balance < 100) {
            alert("Недостатньо коштів для прокрутки!");
        }
    });

    restartButton.addEventListener("click", resetGame);

    function startScroll() {
        const rows = {
            top: ["top1", "top2", "top3"],
            center: ["col1", "col2", "col3"],
            bottom: ["bottom1", "bottom2", "bottom3"]
        };

        let completedRows = 0;

        ["top", "center", "bottom"].forEach((rowType, rowIndex) => {
            rows[rowType].forEach((slotId, slotIndex) => {
                let slotElement = document.getElementById(slotId);
                slotElement.innerHTML = "";

                let imgContainer = document.createElement("div");
                imgContainer.style.position = "relative";
                imgContainer.style.top = "0px";

                for (let i = 0; i < 10; i++) {
                    let img = document.createElement("img");
                    img.src = images[Math.floor(Math.random() * images.length)];
                    img.style.display = "block";
                    img.style.width = "100%";
                    img.style.height = "auto";
                    imgContainer.appendChild(img);
                }
                slotElement.appendChild(imgContainer);

                let position = 0;
                let animationInterval = setInterval(() => {
                    position += 10;
                    imgContainer.style.top = `-${position}px`;

                    if (position >= 200) {
                        clearInterval(animationInterval);

                        finalizeSlot(slotElement, imgContainer, rowType, () => {
                            completedRows++;
                            if (completedRows === 9) checkResult();
                        });
                    }
                }, 50);
            });
        });
    }

    function finalizeSlot(slotElement, imgContainer, rowType, callback) {
        let imgs = Array.from(imgContainer.querySelectorAll("img"));
        let finalImages = imgs.slice(1, 4);
        slotElement.innerHTML = "";
        finalImages.forEach(img => slotElement.appendChild(img));

        callback();
    }

    function checkResult() {
        let col1 = document.querySelectorAll("#col1 img");
        let col2 = document.querySelectorAll("#col2 img");
        let col3 = document.querySelectorAll("#col3 img");

        let isWin =
            col1[1].src === col2[1].src && col2[1].src === col3[1].src;

        let resultMessage = document.getElementById("resultMessage");
        if (isWin) {
            balance += 300;
            resultMessage.textContent = `${userName}, ви виграли! Ваш новий баланс: ${balance} грн`;
            updateBalance();
        } else if (spins % 3 !== 0) {
            resultMessage.textContent = "Спробуйте ще раз!";
        }

        if (attempts >= maxAttempts) {
            generateButton.style.display = "none";
            restartButton.style.display = "inline";
        }
    }

    function updateAttempts() {
        document.getElementById("attemptInfo").textContent = `Спроба ${attempts} з ${maxAttempts}`;
    }

    function updateBalance() {
        document.getElementById("balanceInfo").textContent = `Баланс: ${balance} грн`;
    }

    debtButton.addEventListener("click", () => {
        if (!debt) {
            balance += 500;
            debt = true;
            updateBalance();
            document.getElementById("resultMessage").textContent = "Тепер у Вас є заборгованість.";
        } else {
            alert("Ви вже маєте заборгованість!");
        }
    });


    function resetGame() {
        attempts = 0;
        spins = 0;
        updateAttempts();
        document.getElementById("resultMessage").textContent = "";
        ["top1", "top2", "top3", "col1", "col2", "col3", "bottom1", "bottom2", "bottom3"].forEach(id => {
            document.getElementById(id).innerHTML = "";
        });
        generateButton.style.display = "inline";
        restartButton.style.display = "none";
    }
});
