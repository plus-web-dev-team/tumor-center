const limit = 8;
let offset = 0;
let totalCount = 0;
let currentPage = 1;
const apiKey = '3CeoebN8VtZl0ikcVzwVnWkBujTFdzqOASpT';
const endpoint = 'https://i4i1s3gwi5.microcms.io/api/v1/events';

document.addEventListener("DOMContentLoaded", () => {
    fetchEvents(offset);
});

async function fetchEvents(offset) {
    const container = document.getElementById('event-container');
    const pagination = document.getElementById('pagination');
    container.innerHTML = '<div class="loading">イベントを読み込んでいます...</div>';

    try {
        const response = await fetch(`${endpoint}?limit=${limit}&offset=${offset}`, {
            headers: { 'X-MICROCMS-API-KEY': apiKey }
        });

        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.contents)) throw new Error('`contents` が配列ではありません');

        totalCount = data.totalCount;
        renderEvents(data.contents, container);
        renderPagination(pagination);
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
                    <li class="flex flex-column gap-10 mt-3">
                        ${article.events_form ? `<a class="btn btn-green w-max" href="${article.events_form}" target="_blank" rel="noopener noreferrer">申し込みフォーム</a>` : ''}
                        ${article.events_flyer ? `<a class="btn btn-green w-max" href="${article.events_flyer}" target="_blank" rel="noopener noreferrer">チラシ</a>` : ''}
                    </li>
                </ul>
            </div>
        `;
        // Add accordion toggle functionality
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
            fetchEvents(offset);
        });
        paginationContainer.appendChild(button);
    }
}