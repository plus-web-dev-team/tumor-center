const limit = 100;
let offset = 0;
let currentPage = 1;
const apiKey = '3CeoebN8VtZl0ikcVzwVnWkBujTFdzqOASpT';
const endpoint = 'https://i4i1s3gwi5.microcms.io/api/v1/events';

document.addEventListener("DOMContentLoaded", () => {
    fetchAllEvents();
});

async function fetchAllEvents() {
    const container = document.getElementById('event-container');
    const pagination = document.getElementById('pagination');
    if (!container) {
        console.warn('表示先の #event-container が見つかりません。処理を中断します。');
        return;
    }
    container.innerHTML = '<div class="loading">イベントを読み込んでいます...</div>';
    let allContents = [];
    let offset = 0;
    let totalCount = 0;
    try {
        // まず最初のリクエストでtotalCountを取得
        const firstRes = await fetch(`${endpoint}?limit=${limit}&offset=${offset}`, {
            headers: { 'X-MICROCMS-API-KEY': apiKey }
        });
        if (!firstRes.ok) throw new Error(`HTTPエラー: ${firstRes.status}`);
        const firstData = await firstRes.json();
        if (!Array.isArray(firstData.contents)) throw new Error('`contents` が配列ではありません');
        totalCount = firstData.totalCount;
        allContents = firstData.contents;
        // 2回目以降のリクエスト
        let fetched = allContents.length;
        while (fetched < totalCount) {
            offset += limit;
            const res = await fetch(`${endpoint}?limit=${limit}&offset=${offset}`, {
                headers: { 'X-MICROCMS-API-KEY': apiKey }
            });
            if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data.contents)) throw new Error('`contents` が配列ではありません');
            allContents = allContents.concat(data.contents);
            fetched = allContents.length;
        }
        renderEvents(allContents, container);
        // ページネーション非表示
        if (pagination) pagination.style.display = 'none';
    } catch (err) {
        console.error('取得失敗:', err);
        container.innerHTML = `<div class="error">データの取得に失敗しました：${err.message}</div>`;
    }
}

function renderEvents(contents, container) {
    container.innerHTML = '';
    for (const article of contents) {
        const articleEl = document.createElement('div');
        articleEl.classList.add('accordion');
        articleEl.innerHTML = `
            <div class="accordion-toggle bg-green text-white p-3 radius text-lg mt-0 mb-3" role="button"
                    tabindex="0">${article.events_title}
            </div>
            <div class="accordion-content" style="display: none;">
                <ul class="no-marker mb-3">
                    ${article.events_subject ? `<li>対象：${article.events_subject}</li>` : ''}
                    ${article.events_date ? `<li>日付：${article.events_date}</li>` : ''}
                    ${article.events_time ? `<li>時間：${article.events_time}</li>` : ''}
                    ${article.events_contact ? `<li>申込方法：${article.events_contact}</li>` : ''}
                    ${article.events_staff ? `<li>担当：${article.events_staff}</li>` : ''}
                    ${article.events_comment ? `<li>${article.events_comment}</li>` : ''}
                    <li class="flex flex-column gap-10 mt-3">
                        ${article.events_form ? `<a class="btn btn-green w-max" href="${article.events_form}" target="_blank" rel="noopener noreferrer">申し込みフォーム</a>` : ''}
                        ${article.events_flyer ? `<a class="btn btn-green w-max" href="${article.events_flyer}" target="_blank" rel="noopener noreferrer">チラシ</a>` : ''}
                    </li>
                </ul>
            </div>
        `;
        const toggle = articleEl.querySelector('.accordion-toggle');
        const content = articleEl.querySelector('.accordion-content');
        toggle.addEventListener('click', () => {
            const isOpen = content.style.display === 'block';
            content.style.display = isOpen ? 'none' : 'block';
            toggle.textContent = isOpen ? article.events_title : '閉じる';
        });
        container.appendChild(articleEl);
    }
}

function renderPagination(paginationContainer) {
    if (!paginationContainer) {
        console.warn('#pagination が見つかりません（ページネーションをスキップ）');
        return;
    }

    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(totalCount / limit);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('a');
        button.href = 'javascript:void(0)';
        button.textContent = i;
        button.classList.add('text-orange', 'hover-orange', 'outline-orange');
        if (i === currentPage) {
            button.classList.remove('outline-orange');
            button.classList.add('current-page');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            offset = (i - 1) * limit;
            fetchAllEvents();
        });
        paginationContainer.appendChild(button);
    }
}