(function () {
    var pages = Array.isArray(window.SITE_PAGES) ? window.SITE_PAGES.slice() : [];
    var container = document.getElementById("page-card-list");

    if (!container) {
        return;
    }

    if (!pages.length) {
        container.innerHTML = "<p>暂无可展示的子页面。</p>";
        return;
    }

    pages.sort(function (left, right) {
        return (left.order || 0) - (right.order || 0);
    });

    container.innerHTML = pages.map(function (page) {
        return [
            '<article class="page-card">',
            '    <span class="page-card-status">' + escapeHtml(page.status || "Available") + "</span>",
            "    <h3>" + escapeHtml(page.title || page.slug || "Untitled") + "</h3>",
            "    <p>" + escapeHtml(page.description || "") + "</p>",
            '    <a class="page-card-link" href="' + escapeAttribute(page.href || "#") + '">进入页面</a>',
            "</article>"
        ].join("");
    }).join("");

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }
})();
