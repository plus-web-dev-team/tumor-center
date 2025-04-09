const apiKey = "AX3ShqnvRhW0AwUc7Bl0LpnFajMG8HKMhnhW"; // MicroCMSのAPIキー
const endpoint = "https://tkrizbapte.microcms.io/api/v1/blogs"; // エンドポイントURL
const limit = 5; // 1ページあたりの記事数
const offset = 0; // 取得開始位置
let totalCount = 0; // 全記事数

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded: ページの読み込み完了");
    const contentContainer = document.getElementById("content");

    // APIから記事を取得する関数
    async function fetchArticles(offset) {
        // ローディング表示
        contentContainer.innerHTML =
            '<div class="loading">記事を読み込んでいます...</div>';

        const cacheKey = `microcms_blog_page_${offset}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            console.log("キャッシュからデータを取得");
            renderArticles(JSON.parse(cachedData));
            return;
        }

        try {
            const response = await fetch(
                `${endpoint}?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        "X-API-KEY": apiKey,
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                },
            );

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

    // 記事を表示する関数
    function renderArticles(data) {
        contentContainer.innerHTML = "";

        data.contents.slice(0, 5).forEach((item, index) => {
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

            // コンテンツ部分は別のflex-itemにする
            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("flex-item");

            const content = document.createElement("div");
            content.classList.add("article-content");
            content.style.display = "none"; // 初期は非表示

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
        });
    }

    // 初回ロード
    fetchArticles(offset);
});
