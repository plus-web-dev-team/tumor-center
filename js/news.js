const apiKey = "AX3ShqnvRhW0AwUc7Bl0LpnFajMG8HKMhnhW";
const endpoint = "https://tkrizbapte.microcms.io/api/v1/blogs";
const limit = 5;
let offset = 0;
let totalCount = 0;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded: ページの読み込み完了");
    const contentContainer = document.getElementById("content");
    const paginationContainer = document.getElementById("pagination"); // ページネーション用divを想定

    async function fetchArticles(offset) {
        contentContainer.innerHTML = '<div class="loading">記事を読み込んでいます...</div>';

        const cacheKey = `microcms_blog_page_${offset}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            console.log("キャッシュからデータを取得");
            const parsedData = JSON.parse(cachedData);
            totalCount = parsedData.totalCount; // ここでtotalCountもキャッシュから
            renderArticles(parsedData);
            renderPagination(); // 追加
            return;
        }

        try {
            const response = await fetch(`${endpoint}?limit=${limit}&offset=${offset}`, {
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                },
                mode: "cors",
            });

            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }

            const data = await response.json();

            if (!data.contents || !Array.isArray(data.contents)) {
                throw new Error("データフォーマットが不正です");
            }

            console.log("APIからデータを取得しました:", data);
            totalCount = data.totalCount;
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            renderArticles(data);
            renderPagination(); // 追加
        } catch (error) {
            console.error("APIエラー:", error);
            contentContainer.innerHTML = `
                <div class="error">
                    <p>データの取得に失敗しました。</p>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">再読み込み</button>
                </div>`;
        }
    }

    function renderArticles(data) {
        contentContainer.innerHTML = "";

        for (const item of data.contents) {
            const createdAt = new Date(item.createdAt);
            const formattedDate = `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日`;

            const wrapper = document.createElement("div");
            wrapper.classList.add("flex-item");

            const article = document.createElement("article");
            article.classList.add("article", "bg-blue", "text-white");

            article.innerHTML = `
                <time class="article-date" datetime="${item.createdAt}">${formattedDate}</time>
                <h2 class="article-title hover-orange">${item.title}</h2>
            `;

            wrapper.appendChild(article);
            contentContainer.appendChild(wrapper);

            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("flex-item");

            const content = document.createElement("div");
            content.classList.add("article-content");
            content.style.display = "none";

            contentWrapper.appendChild(content);
            contentContainer.appendChild(contentWrapper);

            const title = article.querySelector(".article-title");
            title.addEventListener("click", () => {
                if (!content.innerHTML) {
                    content.innerHTML = item.content || "コンテンツがありません";
                }
                content.style.display =
                    content.style.display === "none" || !content.style.display
                        ? "block"
                        : "none";
            });
        }
    }

    function renderPagination() {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = "";
        const pageCount = Math.ceil(totalCount / limit);

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement("a");
            button.href = "javascript:void(0)";
            button.textContent = i;
            button.classList.add("text-orange", "hover-orange", "outline-orange"); // 最初はoutline-orangeを付与

            if (i === currentPage) {
                button.classList.remove("outline-orange"); // カレントページだけoutline-orangeを外す
                button.classList.add("current-page");
            }

            button.addEventListener("click", () => {
                currentPage = i;
                offset = (currentPage - 1) * limit;
                fetchArticles(offset); // クラス操作はせず、fetchArticlesに任せる
            });

            paginationContainer.appendChild(button);
        }
    }

    fetchArticles(offset);
});