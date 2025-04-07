const objects = document.querySelectorAll('.object');
const container = document.querySelector('.animation-inner');
const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;
const size = 150; // オブジェクトのサイズ
const velocities = [];
const positions = [];

// 初期位置と速度を設定
for (const [index, object] of objects.entries()) {
    positions[index] = {
        x: Math.random() * (containerWidth - size),
        y: Math.random() * (containerHeight - size)
    };
    velocities[index] = {
        vx: (Math.random() - 0.5) * 4, // 横方向の速度
        vy: (Math.random() - 0.5) * 4  // 縦方向の速度
    };
}

// 文字が消えた後にアニメーションを開始
setTimeout(() => {
    container.style.display = 'block'; // 初期の横並びを解除
    for (const object of objects) {
        object.style.position = 'absolute';
        object.style.animationPlayState = 'running'; // 不定形アニメーションを再開
    }
    updatePositions(); // ランダムな動きを開始
}, 3000); // フェードアウト完了後

// オブジェクトの動きを更新
const updatePositions = () => {
    for (const [i, object] of objects.entries()) {
        // 位置を更新
        positions[i].x += velocities[i].vx;
        positions[i].y += velocities[i].vy;

        // 壁に当たったら反射
        if (positions[i].x <= 0 || positions[i].x >= containerWidth - size) {
            velocities[i].vx *= -1;
        }
        if (positions[i].y <= 0 || positions[i].y >= containerHeight - size) {
            velocities[i].vy *= -1;
        }

        // 他のオブジェクトとの衝突判定
        for (const [j, otherObject] of objects.entries()) {
            if (i !== j) {
                const dx = positions[i].x - positions[j].x;
                const dy = positions[i].y - positions[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < size) {
                    velocities[i].vx *= -1;
                    velocities[i].vy *= -1;
                    velocities[j].vx *= -1;
                    velocities[j].vy *= -1;
                }
            }
        }

        // オブジェクトを移動
        object.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px)`;
    }

    // 再帰的に次のフレームを呼び出す
    requestAnimationFrame(updatePositions);
}

document.addEventListener("DOMContentLoaded", () => {
    // Read More toggle
    const toggleButtons = document.querySelectorAll(".read-more-toggle");

    for (const toggle of toggleButtons) {
        const expandableText = toggle.closest(".flex-item")?.querySelector(".expandable-text");

        let expanded = false;
        if (expandableText) {
            expandableText.classList.remove("expanded");
            toggle.textContent = "続きを読む";

            toggle.addEventListener("click", (e) => {
                e.preventDefault();
                expanded = !expanded;
                expandableText.classList.toggle("expanded", expanded);
                toggle.textContent = expanded ? "閉じる" : "続きを読む";
            });
        }
    }

    // 患者さんへ toggle
    const patientTitles = document.querySelectorAll(".article-patient-title");

    for (const title of patientTitles) {
        const article = title.closest(".article-patient");
        const content = article?.parentNode?.querySelector(".article-patient-content");

        let expanded = false;
        if (content) {
            content.style.display = "none";
            const originalText = title.textContent;

            title.addEventListener("click", (e) => {
                e.preventDefault();
                expanded = !expanded;
                content.style.display = expanded ? "block" : "none";
                title.textContent = expanded ? "閉じる" : originalText;
            });
        }
    }
});

for (const img of document.querySelectorAll("img")) {
    img.setAttribute("loading", "lazy");

    if (!img.hasAttribute("width") || !img.hasAttribute("height")) {
        const tempImg = new Image();
        tempImg.src = img.src;
        tempImg.onload = () => {
            if (!img.hasAttribute("width")) {
                img.setAttribute("width", this.naturalWidth);
            }
            if (!img.hasAttribute("height")) {
                img.setAttribute("height", this.naturalHeight);
            }
        };
    }
}

const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.classList.add("back-to-top--visible");
        } else {
            backToTop.classList.remove("back-to-top--visible");
        }
    });
}

const footer = document.querySelector("footer");

if (backToTop && footer) {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                backToTop.innerHTML = '<a href="#main" aria-label="トップに戻る"><img src="img/footer-top.svg" alt="Back to Top"></a>';
            } else {
                backToTop.innerHTML = '<a href="#main" aria-label="トップに戻る"><img src="img/top.svg" alt="Back to Top"></a>';
            }
        },
        {
            root: null,
            threshold: 0,
        }
    );

    observer.observe(footer);
}

for (const anchor of document.querySelectorAll('a[href^="#"]')) {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 100;
                const top =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    offset;
                window.scrollTo({
                    top,
                    behavior: "smooth",
                });
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".sp-header-header");
    const nav = document.querySelector(".sp-nav");
    const inner = document.querySelector(".sp-header-inner");

    if (header && nav && inner) {
        const updateHeight = () => {
            const headerHeight = header.offsetHeight;
            const navHeight = nav.offsetHeight;
            const total = window.innerHeight;
            const innerHeight = total - headerHeight - navHeight;
            inner.style.height = `${innerHeight}px`;
        };

        updateHeight(); // 初回
        window.addEventListener("resize", updateHeight); // リサイズ時にも対応
    }
});