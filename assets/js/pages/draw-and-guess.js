(function () {
    var data = window.DRAW_AND_GUESS_DATA;
    var container = document.getElementById("game-button-list");
    var caption = document.getElementById("game-caption");

    if (!container || !data || !Array.isArray(data.categories)) {
        if (caption) {
            caption.textContent = "词库加载失败，请稍后重试。";
        }
        return;
    }

    var roundLocked = false;
    var options = data.categories.map(function (category) {
        return {
            key: category.key,
            label: category.label,
            word: pickRandomWord(category.words || [])
        };
    });

    container.innerHTML = options.map(function (option) {
        return [
            '<button class="game-button" type="button" data-key="' + escapeHtml(option.key) + '">',
            "    <strong>" + escapeHtml(option.label) + "：</strong>" + escapeHtml(option.word),
            "</button>"
        ].join("");
    }).join("");

    container.addEventListener("click", function (event) {
        var button = event.target.closest(".game-button");

        if (!button || roundLocked) {
            return;
        }

        roundLocked = true;

        Array.prototype.forEach.call(container.querySelectorAll(".game-button"), function (item) {
            var isSelected = item === button;
            item.disabled = true;
            item.classList.toggle("selected", isSelected);
        });

        if (caption) {
            caption.textContent = "已锁定本轮词条，可以开始作画了。";
        }
    });

    function pickRandomWord(words) {
        if (!words.length) {
            return "暂无词条";
        }

        var index = Math.floor(Math.random() * words.length);
        return words[index];
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
