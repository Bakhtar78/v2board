(function (root, document) {
  "use strict";

  var STORAGE_KEY = "v2board_admin_sidebar_collapsed";
  var STYLE_ID = "v2board-admin-sidebar-styles";
  var LOCKED_CLASS = "v2board-admin-sidebar-locked";
  var ROOT_COLLAPSED_CLASS = "v2board-admin-sidebar-collapsed";
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

  function syncRootState() {
    document.documentElement.classList.toggle(
      ROOT_COLLAPSED_CLASS,
      collapsed && isDesktop(),
    );
  }

  function getLocale() {
    var api = root.V2BOARD_ADMIN_I18N_API;
    return api && api.getLocale ? api.getLocale() : "en-US";
  }

  function getLabels() {
    return LABELS[getLocale()] || LABELS["en-US"];
  }

  function getBackgroundColor(element) {
    if (!element || !root.getComputedStyle) return "";

    var color = root.getComputedStyle(element).backgroundColor;
    if (
      !color ||
      color === "transparent" ||
      color === "rgba(0, 0, 0, 0)"
    ) {
      return "";
    }
    return color;
  }

  function ensureGlobalStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var rootSelector = "html." + ROOT_COLLAPSED_CLASS;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      "#sidebar>.v2board-admin-sidebar-toggle{" +
      "bottom:12px!important;left:20px!important;position:absolute!important;" +
      "right:auto!important;z-index:1040}" +
      "#page-container.sidebar-r #sidebar>.v2board-admin-sidebar-toggle{" +
      "left:auto!important;right:20px!important}" +
      "#sidebar .v2board-sidebar-footer-text{opacity:.2}" +
      "@media(min-width:992px){" +
      rootSelector + " #page-container.sidebar-o{" +
      "padding-left:64px!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r{" +
      "padding-left:0!important;padding-right:64px!important}" +
      rootSelector + " #page-container.page-header-fixed.sidebar-o #page-header," +
      rootSelector + " #page-container.page-header-glass.sidebar-o #page-header{" +
      "padding-left:64px!important}" +
      rootSelector + " #page-container.page-header-fixed.sidebar-o #page-header .overlay-header," +
      rootSelector + " #page-container.page-header-glass.sidebar-o #page-header .overlay-header{" +
      "left:64px!important}" +
      rootSelector + " #page-container.sidebar-r.page-header-fixed.sidebar-o #page-header," +
      rootSelector + " #page-container.sidebar-r.page-header-glass.sidebar-o #page-header{" +
      "padding-left:0!important;padding-right:64px!important}" +
      rootSelector + " #page-container.sidebar-r.page-header-fixed.sidebar-o #page-header .overlay-header," +
      rootSelector + " #page-container.sidebar-r.page-header-glass.sidebar-o #page-header .overlay-header{" +
      "left:0!important;right:64px!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar{" +
      "overflow-x:hidden!important;" +
      "transform:translateX(-186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar{" +
      "transform:translateX(186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .content-header," +
      rootSelector + " #page-container.sidebar-o #sidebar .content-side{" +
      "transform:translateX(186px) translateY(0) translateZ(0)!important;" +
      "width:250px!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar .content-header," +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar .content-side{" +
      "transform:translateX(-186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar:hover{" +
      "transform:translateX(-186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar:hover{" +
      "transform:translateX(186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar:hover .content-header," +
      rootSelector + " #page-container.sidebar-o #sidebar:hover .content-side{" +
      "transform:translateX(186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar:hover .content-header," +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar:hover .content-side{" +
      "transform:translateX(-186px) translateY(0) translateZ(0)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main{" +
      "transform:translateX(-1.125rem)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main .nav-main-link-icon{" +
      "transform:translateX(.75rem)!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar .nav-main{" +
      "transform:translateX(1.125rem)!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar .nav-main .nav-main-link-icon{" +
      "transform:translateX(-1rem)!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main .nav-main-heading," +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main .nav-main-link-badge," +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main .nav-main-link-name{" +
      "opacity:0!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-hide{" +
      "opacity:0!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-show{" +
      "opacity:1!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-hidden.bg-header-dark{" +
      "box-sizing:border-box!important;display:block!important;" +
      "height:var(--v2board-sidebar-brand-height)!important;" +
      "max-width:250px!important;min-height:var(--v2board-sidebar-brand-height)!important;" +
      "min-width:250px!important;overflow:hidden!important;width:250px!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-hidden.bg-header-dark .content-header{" +
      "background-color:var(--v2board-sidebar-brand-bg)!important;" +
      "box-sizing:border-box!important;display:flex!important;" +
      "height:var(--v2board-sidebar-brand-height)!important;" +
      "max-width:250px!important;min-height:var(--v2board-sidebar-brand-height)!important;" +
      "min-width:250px!important;width:250px!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-hidden.bg-header-dark .content-header>*{" +
      "visibility:hidden!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-visible{" +
      "display:inline-block!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .smini-visible-block{" +
      "display:block!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .nav-main>.nav-main-item>.nav-main-submenu{" +
      "display:none!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar .v2board-sidebar-footer-text{" +
      "display:none!important}" +
      rootSelector + " #page-container.sidebar-o #sidebar>.v2board-admin-sidebar-toggle{" +
      "display:inline-flex!important;left:calc(100% - 44px)!important;" +
      "opacity:1!important;right:auto!important;visibility:visible!important}" +
      rootSelector + " #page-container.sidebar-o.sidebar-r #sidebar>.v2board-admin-sidebar-toggle{" +
      "left:20px!important;right:auto!important}" +
      "}";

    (document.head || document.documentElement).appendChild(style);
  }

  function preserveBrandArea(sidebar) {
    var wrapper =
      sidebar && sidebar.querySelector(".smini-hidden.bg-header-dark");
    var brand =
      (wrapper && wrapper.querySelector(".content-header")) ||
      (sidebar && sidebar.querySelector(".content-header"));
    if (!sidebar || !brand) return;

    var pageHeader = document.getElementById("page-header");
    var color = getBackgroundColor(pageHeader) || getBackgroundColor(brand);
    var measuredHeight = brand.getBoundingClientRect
      ? brand.getBoundingClientRect().height
      : 0;
    var savedHeight = parseFloat(
      sidebar.style.getPropertyValue("--v2board-sidebar-brand-height"),
    );
    var stableHeight = Math.max(savedHeight || 0, measuredHeight || 0, 52);

    if (color) {
      sidebar.style.setProperty("--v2board-sidebar-brand-bg", color);
    }
    sidebar.style.setProperty(
      "--v2board-sidebar-brand-height",
      stableHeight + "px",
    );
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
    syncRootState();

    var pageContainer = document.getElementById("page-container");
    if (!pageContainer) return false;

    if (isDesktop()) {
      pageContainer.classList.toggle("sidebar-mini", collapsed);
      pageContainer.classList.toggle(LOCKED_CLASS, collapsed);
    } else {
      pageContainer.classList.remove("sidebar-mini");
      pageContainer.classList.remove(LOCKED_CLASS);
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

  function wrapFooterText(footer) {
    var text = footer.querySelector(".v2board-sidebar-footer-text");
    if (text) return text;

    text = document.createElement("span");
    text.className = "v2board-sidebar-footer-text";

    while (footer.firstChild) {
      text.appendChild(footer.firstChild);
    }
    footer.appendChild(text);
    return text;
  }

  function createToggle() {
    if (document.getElementById("v2board-admin-sidebar-toggle")) return;

    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    toggleHost = document.createElement("span");
    toggleHost.id = "v2board-admin-sidebar-toggle";
    toggleHost.className = "v2board-admin-sidebar-toggle";
    toggleHost.setAttribute("dir", "ltr");

    var shadow = toggleHost.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent =
      ":host{align-items:center;box-sizing:border-box;color:inherit;display:inline-flex;" +
      "flex:0 0 22px;height:22px;justify-content:center;opacity:.65;width:22px}" +
      ":host(:hover),:host(:focus-within){opacity:1}" +
      ".toggle{align-items:center;background:transparent;border:0;border-radius:4px;" +
      "box-sizing:border-box;color:inherit;cursor:pointer;display:flex;height:22px;" +
      "justify-content:center;margin:0;padding:0;transition:background .2s ease;" +
      "width:22px}" +
      ".toggle:hover,.toggle:focus-visible{background:rgba(128,128,128,.16);" +
      "outline:0}" +
      ".icon{fill:currentColor;height:16px;transition:transform .3s ease;" +
      "width:16px}" +
      ':host([data-collapsed="true"]) .icon{transform:rotate(180deg)}' +
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
    syncRootState();

    var sidebar = document.getElementById("sidebar");
    var pageContainer = document.getElementById("page-container");
    if (!sidebar || !pageContainer) return;

    ensureGlobalStyles();
    preserveBrandArea(sidebar);

    var footer = sidebar.querySelector(".v2board-copyright");
    if (footer) wrapFooterText(footer);

    if (!toggleHost || !document.body.contains(toggleHost)) {
      toggleHost = null;
      createToggle();
    }
    applyState();
  }

  function observeChanges() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      syncRootState();
      ensureSidebar();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleViewportChange() {
    var pageContainer = document.getElementById("page-container");
    syncRootState();
    if (pageContainer && !isDesktop()) {
      pageContainer.classList.remove("sidebar-mini");
      pageContainer.classList.remove(LOCKED_CLASS);
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

  syncRootState();
  ensureGlobalStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})(window, document);
