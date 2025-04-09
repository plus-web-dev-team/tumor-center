document.addEventListener("DOMContentLoaded", () => {
    // 続きを読む toggle
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

    // 患者さんへ・お役立ち情報 toggle
    const patientTitles = document.querySelectorAll(".article-title");

    for (const title of patientTitles) {
        const article = title.closest(".article");
        const content = article?.parentNode?.querySelector(".article-content");

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

// img要素 loading="lazy" を追加、幅と高さを設定
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

// トップへ戻るボタン
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

// フッターが画面に入ったら、トップへ戻るボタンの画像を変更
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

// スマホ用ヘッダーの高さ調整
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

// img要素の幅と高さを設定
// img要素にdata-prefer-html-size属性がある場合、幅と高さをHTMLから取得して設定
// ただし、widthとheight属性がない場合のみ
// 画像の幅と高さをstyle属性に設定
for (const img of document.querySelectorAll('img[data-prefer-html-size]')) {
    if (img.hasAttribute('width') && img.hasAttribute('height')) {
        img.style.width = `${img.getAttribute('width')}px`;
        img.style.height = `${img.getAttribute('height')}px`;
    }
}