(function (root, document) {
  "use strict";

  var STORAGE_KEY = "v2board_admin_sidebar_collapsed";
  var DESKTOP_QUERY = "(min-width: 992px)";
  var media = root.matchMedia ? root.matchMedia(DESKTOP_QUERY) : null;
  var observer = null;
  var toggleHost = null;
  var collapsed = readPreference();

  var LABELS = {
    "en-US": {
      collapse: "Collapse sidebar",
      expand: "Expand sidebar",
    },
    "fa-IR": {
      collapse: "بستن نوار کناری",
      expand: "باز کردن نوار کناری",
    },
    "ja-JP": {
      collapse: "サイドバーを折りたたむ",
      expand: "サイドバーを展開する",
    },
    "ko-KR": {
      collapse: "사이드바 접기",
      expand: "사이드바 펼치기",
    },
    "vi-VN": {
      collapse: "Thu gọn thanh bên",
      expand: "Mở rộng thanh bên",
    },
    "zh-CN": {
      collapse: "收起侧边栏",
      expand: "展开侧边栏",
    },
    "zh-TW": {
      collapse: "收合側邊欄",
      expand: "展開側邊欄",
    },
  };

  function readPreference() {
    try {
      return root.localStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function savePreference() {
    try {
      root.localStorage.setItem(STORAGE_KEY, collapsed ? "true" : "false");
    } catch (error) {
      // The toggle still works when browser storage is unavailable.
    }
  }

  function isDesktop() {
    return media ? media.matches : root.innerWidth >= 992;
  }

  function getLocale() {
    var api = root.V2BOARD_ADMIN_I18N_API;
    return api && api.getLocale ? api.getLocale() : "en-US";
  }

  function getLabels() {
    return LABELS[getLocale()] || LABELS["en-US"];
  }

  function updateToggle() {
    if (!toggleHost || !toggleHost.shadowRoot) return;

    var button = toggleHost.shadowRoot.querySelector(".toggle");
    var labels = getLabels();
    var label = collapsed ? labels.expand : labels.collapse;
    if (!button) return;

    button.setAttribute("aria-label", label);
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    button.title = label;
    toggleHost.setAttribute("data-collapsed", collapsed ? "true" : "false");
  }

  function applyState() {
    var pageContainer = document.getElementById("page-container");
    if (!pageContainer) return false;

    if (isDesktop()) {
      pageContainer.classList.toggle("sidebar-mini", collapsed);
    }
    updateToggle();
    return true;
  }

  function toggleSidebar() {
    collapsed = !collapsed;
    savePreference();
    applyState();

    document.dispatchEvent(
      new CustomEvent("v2board:admin-sidebar-changed", {
        detail: { collapsed: collapsed },
      }),
    );
  }

  function createChevronIcon() {
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML =
      '<path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>';
    return icon;
  }

  function createToggle() {
    if (document.getElementById("v2board-admin-sidebar-toggle")) return;

    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    toggleHost = document.createElement("div");
    toggleHost.id = "v2board-admin-sidebar-toggle";
    toggleHost.setAttribute("dir", "ltr");

    var shadow = toggleHost.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent =
      ":host{align-items:center;bottom:0;box-sizing:border-box;display:flex;" +
      "height:4.25rem;justify-content:center;left:0;position:absolute;" +
      "transition:width .45s cubic-bezier(.2,.61,.42,.97);width:250px;" +
      "z-index:4}" +
      ":host([data-collapsed=\"true\"]){transform:translateX(186px);width:64px}" +
      ".toggle{align-items:center;background:transparent;border:0;" +
      "border-top:1px solid rgba(128,128,128,.18);box-sizing:border-box;" +
      "color:inherit;cursor:pointer;display:flex;height:100%;" +
      "justify-content:center;margin:0;padding:0;transition:background .2s ease;" +
      "width:100%}" +
      ".toggle:hover,.toggle:focus-visible{background:rgba(128,128,128,.12);" +
      "outline:0}" +
      ".icon{fill:currentColor;height:22px;transition:transform .3s ease;" +
      "width:22px}" +
      ":host([data-collapsed=\"true\"]) .icon{transform:rotate(180deg)}" +
      "@media(max-width:991.98px){:host{display:none}}";

    var button = document.createElement("button");
    button.className = "toggle";
    button.type = "button";
    button.addEventListener("click", toggleSidebar);
    button.appendChild(createChevronIcon());

    shadow.appendChild(style);
    shadow.appendChild(button);
    sidebar.appendChild(toggleHost);
    updateToggle();
  }

  function ensureSidebar() {
    var sidebar = document.getElementById("sidebar");
    var pageContainer = document.getElementById("page-container");
    if (!sidebar || !pageContainer) return;

    if (!toggleHost || !document.body.contains(toggleHost)) {
      toggleHost = null;
      createToggle();
    }
    applyState();
  }

  function observeChanges() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      ensureSidebar();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleViewportChange() {
    var pageContainer = document.getElementById("page-container");
    if (pageContainer && !isDesktop()) {
      pageContainer.classList.remove("sidebar-mini");
    }
    ensureSidebar();
  }

  function start() {
    ensureSidebar();
    observeChanges();

    if (media && media.addEventListener) {
      media.addEventListener("change", handleViewportChange);
    } else if (media && media.addListener) {
      media.addListener(handleViewportChange);
    } else {
      root.addEventListener("resize", handleViewportChange);
    }

    document.addEventListener("v2board:admin-locale-changed", updateToggle);
  }

  root.V2BOARD_ADMIN_SIDEBAR_API = {
    isCollapsed: function () {
      return collapsed;
    },
    setCollapsed: function (value) {
      collapsed = Boolean(value);
      savePreference();
      applyState();
    },
    toggle: toggleSidebar,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})(window, document);
