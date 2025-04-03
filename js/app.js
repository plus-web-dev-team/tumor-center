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
    const toggle = document.querySelector(".read-more-toggle");
    const expandableText = document.querySelector(".expandable-text");
    let expanded = false;

    if (toggle && expandableText) {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            expanded = !expanded;
            expandableText.classList.toggle("expanded", expanded);
            toggle.textContent = expanded ? "閉じる" : "続きを読む";
        });
    }
});