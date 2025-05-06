document.addEventListener("DOMContentLoaded", function () {
    const generateCardBtn = document.getElementById("generateCardBtn");
    const cardPreview = document.getElementById("cardPreview");
    const shareCardBtn = document.getElementById("shareCardBtn");
    const downloadCardBtn = document.getElementById("downloadCardBtn");
    const imageShareBtn = document.getElementById("imageShareBtn");
    const imageDownloadBtn = document.getElementById("imageDownloadBtn");

    cardPreview.addEventListener("mouseenter", function () {
        this.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
        this.classList.remove("card-float");
    });

    cardPreview.addEventListener("mouseleave", function () {
        this.style.transform = "";
        this.style.boxShadow = "";
        this.classList.add("card-float");
    });

    generateCardBtn.addEventListener("click", function () {
        const momName = document.getElementById("momName").value.trim();
        const cardTitle = document.getElementById("cardTitle").value.trim();
        const message = document.getElementById("cardMessage").value.trim();
        const childName = document.getElementById("childName").value.trim();

        if (!momName || !message || !childName) {
            Swal.fire({
                title: "Eksik Bilgi!",
                text: "Lütfen tüm gerekli alanları doldurun.",
                icon: "warning",
            });
            return;
        }

        document.getElementById("previewTitle").textContent =
            cardTitle || "Sevgili Annem";
        document.getElementById(
            "previewMomName"
        ).textContent = `Sevgili ${momName},`;
        document.getElementById("previewMessage").textContent = message;
        document.getElementById(
            "previewChildName"
        ).textContent = `Sevgilerle, ${childName}`;

        const messageHeight =
            document.getElementById("previewMessage").offsetHeight;
        cardPreview.style.height = "auto";
        cardPreview.classList.remove("hidden");
        cardPreview.scrollIntoView({ behavior: "smooth" });
    });

    async function shareCard() {
        try {
            document.querySelector(".card-buttons").style.display = "none";
            document.querySelector(".preview-buttons").style.display = "none";
            const cardElement = document.getElementById("cardPreview");
            cardElement.classList.add("adjust-for-canvas");

            const canvas = await html2canvas(cardElement, {
                backgroundColor: null,
                scale: 5,
                ignoreElements: (element) => {
                    return (
                        element.classList.contains("preview-buttons") ||
                        element.classList.contains("card-buttons")
                    );
                },
            });

            cardElement.classList.remove("adjust-for-canvas");
            document.querySelector(".card-buttons").style.display = "flex";
            document.querySelector(".preview-buttons").style.display = "block";

            canvas.toBlob(async function (blob) {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            files: [
                                new File([blob], "canim-anneme.png", {
                                    type: "image/png",
                                }),
                            ],
                        });
                    } catch (err) {
                        console.error("Share Fail ", err);
                        downloadImage(canvas);
                    }
                } else {
                    downloadImage(canvas);
                }
            }, "image/png");
        } catch (error) {
            console.error("Error Card ", error);
            document.querySelector(".card-buttons").style.display = "flex";
            document.querySelector(".preview-buttons").style.display = "block";
            Swal.fire({
                title: "Hata!",
                text: "Kart oluşturulurken bir hata oluştu.",
                icon: "error",
            });
        }
    }

    async function downloadCard() {
        try {
            document.querySelector(".card-buttons").style.display = "none";
            document.querySelector(".preview-buttons").style.display = "none";
            const cardElement = document.getElementById("cardPreview");
            cardElement.classList.add("adjust-for-canvas");

            const canvas = await html2canvas(cardElement, {
                backgroundColor: null,
                scale: 2,
                ignoreElements: (element) => {
                    return (
                        element.classList.contains("preview-buttons") ||
                        element.classList.contains("card-buttons")
                    );
                },
            });

            cardElement.classList.remove("adjust-for-canvas");
            document.querySelector(".card-buttons").style.display = "flex";
            document.querySelector(".preview-buttons").style.display = "block";
            downloadImage(canvas);

            Swal.fire({
                title: "Başarılı!",
                text: "Kart başarıyla indirildi.",
                icon: "success",
            });
        } catch (error) {
            console.error("Error Card ", error);
            document.querySelector(".card-buttons").style.display = "flex";
            document.querySelector(".preview-buttons").style.display = "block";
            Swal.fire({
                title: "Hata!",
                text: "Kart oluşturulurken bir hata oluştu.",
                icon: "error",
            });
        }
    }

    function downloadImage(canvas) {
        const link = document.createElement("a");
        link.download = "annem-icin-kart.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    shareCardBtn.addEventListener("click", shareCard);
    imageShareBtn.addEventListener("click", shareCard);
    downloadCardBtn.addEventListener("click", downloadCard);
    imageDownloadBtn.addEventListener("click", downloadCard);
});
