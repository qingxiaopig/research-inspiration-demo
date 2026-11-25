/* 科研灵感平台 · 纯静态前端演示
 * 无框架、无构建、无后端。双击 index.html 即可运行。
 */
(function () {
  "use strict";

  var D = window.RI_DATA;
  var ROOT = document.getElementById("app");
  var TOAST = document.getElementById("toast");
  var AUTH_KEY = "research-inspiration.auth.v1";
  var memoryAuth = null;
  var pendingScroll = null;
  var toastTimer = null;
  var reduceMotion = false;

  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { reduceMotion = false; }

  /* ---------- 图标 ---------- */
  var ICONS = {
    database: '<ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/><path d="M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    search: '<circle cx="11" cy="11" r="6.2"/><path d="M16 16l4.2 4.2"/>',
    messages: '<path d="M4 5.5h8.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-3 2.5v-2.5H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/><path d="M14.5 9.5h6a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2h-2.5v2l-2.5-2h-1"/>',
    spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z"/><path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8-2.2-2.2-.8.8-2.2z"/>',
    atom: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9" ry="4.1"/><ellipse cx="12" cy="12" rx="9" ry="4.1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4.1" transform="rotate(120 12 12)"/>',
    cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21"/><rect x="10" y="10" width="4" height="4" rx=".6"/>',
    layers: '<path d="M12 3.2l9 4.8-9 4.8L3 8l9-4.8z"/><path d="M3 12l9 4.8 9-4.8"/><path d="M3 16l9 4.8 9-4.8"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6.5L5.2 19a1 1 0 0 0 .9 1.5h11.8a1 1 0 0 0 .9-1.5L14 9.5V3"/><path d="M7.5 14h9"/>',
    branch: '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 8v8"/><path d="M8 11h6a4 4 0 0 0 4-4v0"/>',
    link: '<path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2-2a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2 2a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V7M16 16v-7"/>',
    refresh: '<path d="M19.5 11a7.5 7.5 0 0 0-13-4.6L4.5 8.5"/><path d="M4.5 3.5v5h5"/><path d="M4.5 13a7.5 7.5 0 0 0 13 4.6l2-2.1"/><path d="M19.5 20.5v-5h-5"/>',
    network: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.6 7.2l8.6.7M8.2 7.8l2.8 8.6M16.8 8.6l-3.5 7.6"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.7-3.6 3.4-5.5 7-5.5s6.3 1.9 7 5.5"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>'
  };

  var SOURCE_CLASS = {
    "中科大项目": "source-ustc",
    "浙江大学": "source-zju",
    "平台沉淀": "source-plat"
  };

  /* ---------- 工具 ---------- */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function icon(name) {
    var path = ICONS[name] || ICONS.spark;
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  function brandMark() {
    return '<svg class="brand-svg" viewBox="0 0 32 32" aria-hidden="true">' +
      '<rect width="32" height="32" rx="9.5" fill="currentColor"/>' +
      '<path d="M16 16L24.2 10.2M16 16l8.4 6.2M16 16L7.8 21.7M16 16L8 10.4M16 16v7.6" stroke="#fff" stroke-width=".9" opacity=".5" fill="none"/>' +
      '<circle cx="16" cy="16" r="2.35" fill="#fff"/>' +
      '<circle cx="24.2" cy="10.2" r="1.65" fill="#fff" opacity=".92"/>' +
      '<circle cx="24.4" cy="21.9" r="1.65" fill="#fff" opacity=".92"/>' +
      '<circle cx="7.8" cy="21.7" r="1.65" fill="#fff" opacity=".92"/>' +
      '<circle cx="8" cy="10.4" r="1.65" fill="#fff" opacity=".92"/>' +
      "</svg>";
  }

  function sourceTag(source) {
    var cls = SOURCE_CLASS[source] || "source-plat";
    return '<span class="source-tag ' + cls + '">' + esc(source) + "</span>";
  }

  function sourceTags(sources) {
    return sources.map(sourceTag).join("");
  }

  function twoDigit(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function getAuth() {
    try {
      var raw = window.localStorage.getItem(AUTH_KEY);
      if (!raw) return memoryAuth;
      var parsed = JSON.parse(raw);
      return parsed && parsed.account ? parsed : null;
    } catch (e) {
      return memoryAuth;
    }
  }

  function setAuth(value) {
    memoryAuth = value;
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    } catch (e) {
      /* file:// 下部分浏览器会禁用 localStorage，本次会话仍可继续。 */
    }
  }

  /* ---------- 静态演示身份：无需登录，自动使用预置演示账号 ---------- */
  function ensureDemoSession() {
    var current = getAuth();
    if (current && current.account) return current;
    var demo = {
      account: D.product.demoAccount,
      name: D.product.demoName,
      role: D.product.demoRole,
      demo: true,
      at: Date.now()
    };
    setAuth(demo);
    return demo;
  }

  /* ---------- 访问统计：无后端，按浏览器本地计数 ---------- */
  var VISITS_KEY = "research-inspiration.visits.demo.v1";
  var visitStats = null;
  var visitHitDone = false;

  function fmtCount(value) {
    var num = Number(value);
    return isFinite(num) ? num.toLocaleString("zh-CN") : "0";
  }

  function paintVisits() {
    var badge = document.getElementById("visit-badge");
    if (!badge || !visitStats) return;
    var visitors = badge.querySelector("[data-visitors]");
    var visits = badge.querySelector("[data-visits]");
    if (visitors) visitors.textContent = fmtCount(visitStats.visitors);
    if (visits) visits.textContent = fmtCount(visitStats.visits);
    badge.hidden = false;
  }

  function loadVisits() {
    var data = { visitors: 0, visits: 0 };
    try {
      var raw = window.localStorage.getItem(VISITS_KEY);
      if (raw) data = JSON.parse(raw) || data;
    } catch (e) { data = { visitors: 0, visits: 0 }; }
    if (!visitHitDone) {
      visitHitDone = true;
      data.visitors = (Number(data.visitors) || 0) + 1;
      data.visits = (Number(data.visits) || 0) + 1;
      try { window.localStorage.setItem(VISITS_KEY, JSON.stringify(data)); } catch (e) { /* noop */ }
    }
    visitStats = data;
    paintVisits();
  }

  function showToast(message) {
    if (!TOAST) return;
    TOAST.textContent = message;
    TOAST.hidden = false;
    TOAST.classList.remove("is-show");
    void TOAST.offsetWidth;
    TOAST.classList.add("is-show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      TOAST.classList.remove("is-show");
      toastTimer = window.setTimeout(function () { TOAST.hidden = true; }, 180);
    }, 2400);
  }

  function parseRoute() {
    var raw = window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
    var parts = raw.split("?");
    var path = parts[0];
    var query = {};
    if (parts[1]) {
      var pairs = parts[1].split("&");
      for (var i = 0; i < pairs.length; i += 1) {
        var kv = pairs[i].split("=");
        if (kv[0]) query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
      }
    }
    if (path.indexOf("step/") === 0) {
      return { name: "step", id: path.slice(5), query: query };
    }
    if (path === "home") return { name: "home", query: query };
    return { name: "home", query: query };
  }

  function findStep(id) {
    for (var i = 0; i < D.steps.length; i += 1) {
      if (D.steps[i].id === id) return D.steps[i];
    }
    return null;
  }

  function findModule(id) {
    for (var i = 0; i < D.steps.length; i += 1) {
      var step = D.steps[i];
      for (var j = 0; j < step.modules.length; j += 1) {
        if (step.modules[j].id === id) {
          return { step: step, module: step.modules[j] };
        }
      }
    }
    return null;
  }

  function allModules() {
    var out = [];
    D.steps.forEach(function (step) {
      step.modules.forEach(function (mod) {
        out.push({ step: step, module: mod });
      });
    });
    return out;
  }

  function sourceCounts() {
    var counts = {};
    allModules().forEach(function (item) {
      var key = item.module.source;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  function closeAllPanels() {
    var panel = document.getElementById("steps-panel");
    var toggle = document.getElementById("steps-toggle");
    if (panel && !panel.hidden) {
      panel.hidden = true;
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        var wrap = toggle.closest(".nav-dropdown");
        if (wrap) wrap.classList.remove("is-open");
      }
    }
    var mobile = document.getElementById("mobile-panel");
    var mobileBtn = document.getElementById("mobile-menu-btn");
    if (mobile && !mobile.hidden) {
      mobile.hidden = true;
      if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
    }
    var popover = document.getElementById("user-popover");
    var userBtn = document.getElementById("user-btn");
    if (popover && !popover.hidden) {
      popover.hidden = true;
      if (userBtn) userBtn.setAttribute("aria-expanded", "false");
    }
  }

  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------- 页头 ---------- */
  function renderHeader(mode, route) {
    var auth = ensureDemoSession();
    var currentStep = route.name === "step" ? findStep(route.id) : null;
    var homeHref = "#/home";
    var nav = "";

    if (mode === "app") {
      var stepLinks = D.steps.map(function (step) {
        var active = currentStep && currentStep.id === step.id ? " is-current" : "";
        return '<a class="dropdown-link' + active + '" href="#/step/' + step.id + '">' +
          '<span class="dropdown-no">' + twoDigit(step.no) + "</span>" +
          '<span class="dropdown-copy"><strong>' + esc(step.title) + "</strong><small>" + step.modules.length + " 个能力模块</small></span>" +
          "</a>";
      }).join("");

      nav = '<nav class="nav-desktop" aria-label="主导航">' +
        '<a class="nav-link' + (route.name === "home" ? " is-active" : "") + '" href="#/home">首页</a>' +
        '<div class="nav-dropdown">' +
        '<button class="nav-link' + (currentStep ? " is-active" : "") + '" id="steps-toggle" type="button" aria-expanded="false" aria-controls="steps-panel">五步法' +
        '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6.5L8 10l4-3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        '<div class="steps-panel" id="steps-panel" hidden>' +
        '<div class="steps-panel-head"><span>RESEARCH LOOP</span><small>从知识到沉淀</small></div>' +
        stepLinks +
        "</div></div>" +
        '<button class="nav-link" type="button" data-scroll="capability">能力地图</button>' +
        '<a class="nav-link" href="debate.html">辩论演示</a>' +
        "</nav>";
    }

    var visitBadge = '<span class="visit-badge" id="visit-badge" hidden aria-label="访问统计">' +
      '<span class="visit-item"><b data-visitors>0</b><small>访问人数</small></span>' +
      '<span class="visit-sep" aria-hidden="true"></span>' +
      '<span class="visit-item"><b data-visits>0</b><small>访问次数</small></span>' +
      "</span>";

    var headerActions = "";
    if (mode === "app" && auth) {
      headerActions = '<div class="header-actions">' + visitBadge +
        '<span class="env-badge"><i></i>AI4S · 演示环境</span>' +
        '<div class="user-wrap">' +
        '<button class="user-btn" id="user-btn" type="button" aria-expanded="false" aria-controls="user-popover">' +
        '<span class="avatar">' + esc(auth.name.slice(0, 1)) + "</span>" +
        '<span class="user-name">' + esc(auth.name) + "</span>" +
        '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6.5L8 10l4-3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        '<div class="user-popover" id="user-popover" hidden>' +
        '<div class="user-popover-head"><span class="avatar avatar-lg">' + esc(auth.name.slice(0, 1)) + "</span>" +
        "<div><strong>" + esc(auth.name) + "</strong><small>@" + esc(auth.account) + " · " + esc(auth.role) + "</small></div></div>" +
        '<a class="popover-item" href="#/home"><span>平台首页</span><span class="popover-key">⌘</span></a>' +
        '<div class="popover-item is-static"><span>静态 Demo</span><span class="popover-key">免登录</span></div>' +
        '<p class="popover-note">GitHub Pages 静态演示 · 预置账号，无后端会话</p>' +
        "</div></div>" +
        '<button class="menu-btn" id="mobile-menu-btn" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-panel">' +
        '<span></span><span></span><span></span>' +
        "</button>" +
        "</div>";
    } else {
      headerActions = '<div class="header-actions">' + visitBadge +
        '<span class="env-badge"><i></i>AI4S · 演示环境</span></div>';
    }

    var mobilePanel = "";
    if (mode === "app" && auth) {
      var mobileStepLinks = D.steps.map(function (step) {
        return '<a class="mobile-step" href="#/step/' + step.id + '"><span>' + twoDigit(step.no) + "</span>" + esc(step.title) + "</a>";
      }).join("");
      mobilePanel = '<div class="mobile-panel" id="mobile-panel" hidden>' +
        '<a class="mobile-link" href="#/home">首页</a>' +
        '<div class="mobile-label">科研五步法</div>' +
        mobileStepLinks +
        '<button class="mobile-link" type="button" data-scroll="capability">能力地图</button>' +
        '<a class="mobile-link" href="debate.html">辩论演示</a>' +
        "</div>";
    }

    return '<header class="site-header" id="site-header">' +
      '<div class="header-inner">' +
      '<a class="brand" href="' + homeHref + '" aria-label="' + esc(D.product.name) + '首页">' +
      '<span class="brand-mark">' + brandMark() + "</span>" +
      '<span class="brand-text"><strong>' + esc(D.product.name) + "</strong><small>" + esc(D.product.en) + "</small></span>" +
      "</a>" +
      nav + headerActions +
      "</div>" + mobilePanel +
      "</header>";
  }

  /* ---------- 页脚 ---------- */
  function renderFooter() {
    var counts = sourceCounts();
    var total = allModules().length;
    var friends = (D.friendLinks || []).map(function (link) {
      return '<a class="friend-card" href="' + esc(link.href) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="friend-top">' +
        '<span class="friend-logo"><img src="' + esc(link.icon) + '" alt="' + esc(link.alt || link.name + " logo") + '" loading="lazy"></span>' +
        '<span class="friend-name">' + esc(link.name) + "</span>" +
        '<span class="friend-arrow" aria-hidden="true">' + icon("external") + "</span>" +
        "</span>" +
        '<span class="friend-desc">' + esc(link.desc) + "</span>" +
        "</a>";
    }).join("");

    return '<footer class="site-footer">' +
      '<div class="footer-inner">' +
      '<div class="footer-brand"><span class="brand-mark brand-mark-sm">' + brandMark() + "</span>" +
      '<div><strong>' + esc(D.product.name) + "</strong><small>" + esc(D.product.en) + "</small></div></div>" +
      '<div class="footer-stats"><span><b>' + twoDigit(D.steps.length) + "</b> 个阶段</span><span><b>" + total + "</b> 个能力模块</span><span><b>" + (counts["中科大项目"] || 0) + "</b> 中科大项目</span></div>" +
      "</div>" +
      (friends ? '<div class="footer-friends">' +
        '<div class="footer-friends-head"><span class="friend-mark">' + icon("spark") + "</span><strong>友情链接</strong></div>" +
        '<div class="friend-grid">' + friends + "</div>" +
        "</div>" : "") +
      "</footer>";
  }

  /* ---------- 首页 ---------- */
  function renderStepCard(step, index) {
    var sources = [];
    step.modules.forEach(function (mod) {
      if (sources.indexOf(mod.source) === -1) sources.push(mod.source);
    });
    return '<a class="step-card" href="#/step/' + step.id + '" style="--i:' + index + '">' +
      '<div class="step-card-top"><span class="step-num">' + twoDigit(step.no) + "</span>" +
      '<span class="step-icon">' + icon(step.icon) + "</span>" +
      '<span class="step-count">' + step.modules.length + " 个模块</span></div>" +
      "<h3>" + esc(step.title) + "</h3>" +
      '<p class="step-tagline">' + esc(step.tagline) + "</p>" +
      '<div class="step-foot"><span class="step-source">' + sources.map(function (s) { return esc(s); }).join(" + ") + "</span>" +
      '<span class="step-go">进入板块 <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4"/></svg></span></div>' +
      "</a>";
  }

  function renderCapabilityMap() {
    var rows = D.steps.map(function (step) {
      var srcSet = [];
      step.modules.forEach(function (mod) {
        if (srcSet.indexOf(mod.source) === -1) srcSet.push(mod.source);
      });
      var names = step.modules.map(function (mod) { return mod.kicker || mod.title; }).join(" · ");
      return '<a class="cap-row" href="#/step/' + step.id + '">' +
        '<span class="cap-no">' + twoDigit(step.no) + "</span>" +
        '<span class="cap-main"><strong>' + esc(step.title) + "<i>" + step.modules.length + "</i></strong><small>" + esc(names) + "</small></span>" +
        '<span class="cap-source">' + sourceTags(srcSet) + "</span>" +
        '<span class="cap-arrow" aria-hidden="true">→</span>' +
        "</a>";
    }).join("");
    return '<div class="cap-map">' +
      '<div class="cap-map-head"><span>阶段</span><span>能力模块</span><span>来源</span><span></span></div>' +
      rows +
      "</div>";
  }

  function renderSourcePanel() {
    var counts = sourceCounts();
    var total = allModules().length;
    var order = ["中科大项目", "浙江大学", "平台沉淀"];
    var bar = order.map(function (key) {
      var count = counts[key] || 0;
      if (!count) return "";
      var pct = (count / total) * 100;
      return '<span class="source-seg ' + (SOURCE_CLASS[key] || "source-plat") + '" style="width:' + pct.toFixed(2) + '%" title="' + esc(key) + " " + count + '"></span>';
    }).join("");
    var legend = order.map(function (key) {
      var count = counts[key] || 0;
      if (!count) return "";
      return '<div class="source-legend-row"><span class="legend-dot ' + (SOURCE_CLASS[key] || "source-plat") + '"></span><span class="legend-name">' + esc(key) + '</span><b>' + count + "</b></div>";
    }).join("");
    var orgCount = Object.keys(counts).filter(function (key) { return key !== "平台沉淀"; }).length;
    return '<aside class="source-panel">' +
      '<div class="panel-head"><span class="panel-kicker">SOURCE MAP</span><h3>来源构成</h3></div>' +
      '<div class="source-bar" aria-hidden="true">' + bar + "</div>" +
      '<div class="source-legend">' + legend + "</div>" +
      '<div class="source-summary"><span><b>' + total + "</b> 个能力模块</span><span><b>" + twoDigit(orgCount) + "</b> 家机构来源</span></div>" +
      '<p class="source-note">第 5 步原始资料未标注机构来源，以“平台沉淀”标识。</p>' +
      "</aside>";
  }

  function renderFeatured() {
    var cards = D.featured.map(function (id) {
      var found = findModule(id);
      if (!found) return "";
      var step = found.step;
      var mod = found.module;
      return '<a class="feature-card" href="#/step/' + step.id + '">' +
        '<div class="feature-top"><span class="icon-tile icon-solid">' + icon(mod.icon) + "</span>" +
        '<span class="feature-step">STEP ' + twoDigit(step.no) + " · " + esc(step.title) + "</span>" +
        '<span class="feature-source">' + sourceTag(mod.source) + "</span></div>" +
        '<span class="module-kicker">' + esc(mod.kicker) + "</span>" +
        "<h3>" + esc(mod.title) + "</h3>" +
        '<p class="feature-desc">' + esc(mod.intro) + "</p>" +
        '<div class="chips feature-chips">' + mod.points.slice(0, 3).map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") + "</div>" +
        '<div class="feature-foot">进入第 ' + step.no + " 步 <span aria-hidden=\"true\">→</span></div>" +
        "</a>";
    }).join("");
    return '<section class="section" id="featured">' +
      '<div class="section-head"><span class="section-title"><i></i><h2>代表性能力</h2></span>' +
      '<p class="section-sub">从五个阶段中挑出三项，快速感受平台的能力密度。</p></div>' +
      '<div class="feature-grid">' + cards + "</div>" +
      "</section>";
  }

  function renderHome() {
    var total = allModules().length;
    var counts = sourceCounts();
    var orgCount = Object.keys(counts).filter(function (key) { return key !== "平台沉淀"; }).length;
    var heroTitle = D.product.hero.title.replace(
      D.product.hero.highlight,
      "<em>" + esc(D.product.hero.highlight) + "</em>"
    );
    var pipeline = D.steps.map(renderStepCard).join("");
    return renderHeader("app", { name: "home" }) +
      '<main class="home-page" id="main">' +
      '<section class="hero">' +
      '<div class="hero-decor hero-decor-left" aria-hidden="true">' +
      '<svg viewBox="0 0 140 140" fill="none" stroke="currentColor" stroke-width="1"><circle cx="48" cy="54" r="5"/><circle cx="98" cy="38" r="4"/><circle cx="112" cy="92" r="6"/><circle cx="62" cy="108" r="4.5"/><path d="M53 52l40-12M101 42l10 44M107 96l-40 10M64 104l-12-46M52 50l58 2M96 44l-32 58"/></svg>' +
      "</div>" +
      '<div class="hero-decor hero-decor-right" aria-hidden="true">' +
      '<svg viewBox="0 0 140 140" fill="none" stroke="currentColor" stroke-width="1"><rect x="42" y="42" width="48" height="48" rx="8"/><path d="M42 60h-12M42 72h-12M54 42v-12M66 42v-12M90 60h12M90 72h12M54 90v12M66 90v12"/><circle cx="66" cy="66" r="10"/><path d="M66 56v-8M66 76v8M56 66h-8M76 66h8"/></svg>' +
      "</div>" +
      '<div class="hero-inner">' +
      '<span class="pill"><i></i>' + esc(D.product.hero.pill) + "</span>" +
      '<h1 class="hero-title">' + heroTitle + "</h1>" +
      '<p class="hero-en">' + esc(D.product.hero.enLine) + "</p>" +
      '<p class="hero-sub">' + esc(D.product.hero.sub) + "</p>" +
      '<div class="hero-divider" aria-hidden="true"><span></span>' +
      '<svg viewBox="0 0 60 16" fill="none" stroke="currentColor" stroke-width="1"><circle cx="8" cy="8" r="3"/><circle cx="22" cy="8" r="2"/><circle cx="30" cy="8" r="2"/><circle cx="52" cy="8" r="3"/><path d="M11 8h8M32 8h8"/></svg>' +
      "<span></span></div>" +
      '<div class="hero-actions"><button class="btn btn-primary" type="button" data-scroll="pipeline">开始五步法</button>' +
      '<button class="btn btn-ghost" type="button" data-scroll="capability">查看能力地图</button></div>' +
      '<div class="hero-stats">' +
      '<div class="hero-stat"><span class="stat-value">05</span><span class="stat-label">科研阶段</span></div>' +
      '<div class="hero-stat"><span class="stat-value">' + twoDigit(total) + '</span><span class="stat-label">能力模块</span></div>' +
      '<div class="hero-stat"><span class="stat-value">' + twoDigit(orgCount) + '</span><span class="stat-label">机构来源</span></div>' +
      '<div class="hero-stat"><span class="stat-value">01</span><span class="stat-label">闭环链路</span></div>' +
      "</div>" +
      "</div>" +
      "</section>" +

      '<section class="section" id="pipeline">' +
      '<div class="section-head"><span class="section-title"><i></i><h2>科研五步法</h2></span>' +
      '<p class="section-sub">从知识到实验，再回到底层能力：点击任一阶段进入板块详情。</p></div>' +
      '<div class="pipeline">' + pipeline + "</div>" +
      '<div class="loop-note"><span class="loop-icon">' + icon("refresh") + "</span>" +
      "<p><strong>闭环不是终点。</strong>第 5 步的反馈与沉淀回流至第 1 步，让知识与方案在下一轮科研中继续生长。</p>" +
      '<span class="loop-badge">持续进化</span></div>' +
      "</section>" +

      '<section class="section" id="capability">' +
      '<div class="section-head"><span class="section-title"><i></i><h2>能力地图</h2></span>' +
      '<p class="section-sub">按阶段浏览全部 ' + total + ' 个能力模块，或从右侧查看来源构成。</p></div>' +
      '<div class="cap-layout">' + renderCapabilityMap() + renderSourcePanel() + "</div>" +
      "</section>" +

      renderFeatured() +
      "</main>" +
      renderFooter();
  }

  /* ---------- 模块内容 ---------- */
  /* 把完整 blocks 压成一行可扫读的摘要：Top 5 > 分层架构 > 数据源 > 流程 > 规模。 */
  function moduleDigest(mod) {
    var blocks = mod.blocks || [];
    var picked = {};
    blocks.forEach(function (block) {
      if (!picked[block.type]) picked[block.type] = block;
    });

    if (picked.top5) {
      return {
        label: "Top 5",
        chips: picked.top5.items.map(function (item) {
          return item.name + (item.alias ? "（" + item.alias + "）" : "");
        })
      };
    }
    if (picked.arch) {
      return {
        label: picked.arch.label || "分层架构",
        flow: [picked.arch.compile, picked.arch.storeTitle, picked.arch.retrieve]
      };
    }
    if (picked.tags) {
      return { label: picked.tags.label || "标签", chips: picked.tags.items };
    }
    if (picked.flow) {
      return { label: picked.flow.label || "流程", flow: picked.flow.items };
    }
    if (picked.stats) {
      return {
        label: picked.stats.label || "规模",
        chips: picked.stats.items.map(function (item) { return item.value + " " + item.label; })
      };
    }
    return null;
  }

  function renderModule(mod) {
    var demo = mod.onlineDemo || null;
    var isLive = !!demo;
    var digest = moduleDigest(mod);
    var digestText = digest ? (digest.chips || digest.flow) : [];
    /* 有摘要行时，关键词收敛到 3 个，避免与摘要重复堆叠。 */
    var points = (mod.points || []).filter(function (point) {
      return digestText.indexOf(point) === -1;
    }).slice(0, digest ? 3 : 5);
    var demoHint = demo && demo.hint ? demo.hint : "打开静态辩论演示";
    var demoUrl = demo && demo.url ? demo.url : "";

    var side = (isLive ? '<span class="live-badge"><i></i>静态演示</span>' : "") +
      (mod.placeholderNote ? '<span class="placeholder-badge">占位展示</span>' : "") +
      sourceTag(mod.source);

    var digestBody = "";
    if (digest) {
      if (digest.flow) {
        digestBody = digest.flow.map(function (text, index) {
          return '<span class="digest-chip">' + esc(text) + "</span>" +
            (index < digest.flow.length - 1 ? '<span class="digest-arrow" aria-hidden="true">→</span>' : "");
        }).join("");
      } else {
        digestBody = digest.chips.map(function (text, index) {
          return '<span class="digest-chip">' + esc(text) + "</span>" +
            (index < digest.chips.length - 1 ? '<span class="meta-sep" aria-hidden="true">·</span>' : "");
        }).join("");
      }
    }

    var inner =
      '<div class="module-head">' +
      '<span class="icon-tile icon-solid">' + icon(mod.icon) + "</span>" +
      '<div class="module-head-copy"><span class="module-category">' + esc(mod.category) + "</span>" +
      '<span class="module-kicker">' + esc(mod.kicker) + "</span></div>" +
      '<div class="module-side">' + side + "</div>" +
      "</div>" +
      "<h2>" + esc(mod.title) + "</h2>" +
      '<p class="module-intro">' + esc(mod.intro) + "</p>" +
      (digest ? '<div class="module-digest"><span class="digest-label">' + esc(digest.label) + '</span><div class="digest-body">' + digestBody + "</div></div>" : "") +
      (points.length ? '<div class="module-points">' + points.map(function (point, index) {
        return "<span>" + esc(point) + "</span>" +
          (index < points.length - 1 ? '<span class="meta-sep" aria-hidden="true">·</span>' : "");
      }).join("") + "</div>" : "") +
      (mod.placeholderNote ? '<p class="module-placeholder">' + esc(mod.placeholderNote) + "</p>" : "") +
      (isLive && demoUrl ? '<span class="module-foot">' + esc(demoHint) + '<span class="foot-arrow" aria-hidden="true">→</span></span>' : "");

    if (isLive && demoUrl) {
      return '<a class="module-card module-card--live" id="module-' + mod.id + '" href="' + esc(demoUrl) + '" aria-label="' + esc(demoHint) + '">' + inner + "</a>";
    }
    return '<article class="module-card" id="module-' + mod.id + '">' + inner + "</article>";
  }

  function renderStepper(current) {
    var items = D.steps.map(function (step) {
      var cls = step.no < current.no ? " is-done" : step.no === current.no ? " is-current" : "";
      var aria = step.no === current.no ? ' aria-current="step"' : "";
      return '<a class="stepper-item' + cls + '" href="#/step/' + step.id + '"' + aria + ">" +
        '<span class="stepper-dot">' + twoDigit(step.no) + "</span>" +
        '<span class="stepper-label">' + esc(step.title) + "</span>" +
        "</a>";
    }).join("");
    var progress = ((current.no - 1) / (D.steps.length - 1)) * 100;
    return '<nav class="stepper" aria-label="科研五步法进度">' +
      '<div class="stepper-line"><span style="width:' + progress.toFixed(2) + '%"></span></div>' +
      '<div class="stepper-items">' + items + "</div>" +
      "</nav>";
  }

  function renderPager(step) {
    var index = D.steps.indexOf(step);
    var prev;
    if (index > 0) {
      var p = D.steps[index - 1];
      prev = '<a class="pager-card" href="#/step/' + p.id + '"><span class="pager-label">← 上一步</span><strong>' + twoDigit(p.no) + " · " + esc(p.title) + "</strong><small>" + esc(p.output) + "</small></a>";
    } else {
      prev = '<a class="pager-card" href="#/home"><span class="pager-label">← 返回</span><strong>平台首页</strong><small>查看五步法总览</small></a>';
    }
    var next;
    if (index < D.steps.length - 1) {
      var n = D.steps[index + 1];
      next = '<a class="pager-card pager-next" href="#/step/' + n.id + '"><span class="pager-label">下一步 →</span><strong>' + twoDigit(n.no) + " · " + esc(n.title) + "</strong><small>" + esc(n.output) + "</small></a>";
    } else {
      var first = D.steps[0];
      next = '<a class="pager-card pager-next pager-loop" href="#/step/' + first.id + '"><span class="pager-label">' + icon("refresh") + ' 闭环回到</span><strong>' + twoDigit(first.no) + " · " + esc(first.title) + "</strong><small>反馈与沉淀回流到知识底座</small></a>";
    }
    return '<nav class="step-pager" aria-label="阶段切换">' + prev + next + "</nav>";
  }

  function renderStepPage(step) {
    var modules = step.modules.map(function (mod) { return renderModule(mod, step); }).join("");
    var sourceNote = step.sourceNote ? '<p class="step-source-note">' + esc(step.sourceNote) + "</p>" : "";
    return renderHeader("app", { name: "step", id: step.id }) +
      '<main class="detail-page" id="main">' +
      '<div class="breadcrumb"><a href="#/home">首页</a><span>/</span><span>科研五步法</span><span>/</span><strong>' + esc(step.title) + "</strong></div>" +
      '<section class="step-hero">' +
      '<div class="step-hero-copy">' +
      '<span class="eyebrow">STEP ' + twoDigit(step.no) + " / " + twoDigit(D.steps.length) + " · " + esc(step.en) + "</span>" +
      "<h1>" + esc(step.title) + "</h1>" +
      '<p class="step-lede">' + esc(step.summary) + "</p>" +
      '<div class="step-meta"><span class="meta-item">' + step.modules.length + " 个能力模块</span><span class=\"meta-divider\"></span>" +
      '<span class="meta-item">阶段产出：' + esc(step.output) + "</span>" +
      '<span class="meta-sources">' + sourceTags(step.sources) + "</span></div>" +
      "</div>" +
      '<div class="step-watermark" aria-hidden="true">' + twoDigit(step.no) + "</div>" +
      "</section>" +
      renderStepper(step) +
      '<section class="modules">' +
      '<div class="section-head"><span class="section-title"><i></i><h2>阶段能力模块</h2></span>' +
      '<p class="section-sub">共 ' + step.modules.length + ' 个模块 · 来源：' + step.sources.map(esc).join(" / ") + "</p></div>" +
      sourceNote +
      '<div class="module-grid' + (step.modules.length === 2 ? " module-grid--two" : "") + '">' + modules + "</div>" +
      "</section>" +
      renderPager(step) +
      "</main>" +
      renderFooter();
  }

  /* ---------- 页头交互 ---------- */
  function bindHeader() {
    var stepsToggle = document.getElementById("steps-toggle");
    var stepsPanel = document.getElementById("steps-panel");
    var mobileBtn = document.getElementById("mobile-menu-btn");
    var mobilePanel = document.getElementById("mobile-panel");
    var userBtn = document.getElementById("user-btn");
    var userPopover = document.getElementById("user-popover");

    if (stepsToggle && stepsPanel) {
      stepsToggle.addEventListener("click", function () {
        var open = stepsPanel.hidden;
        closeAllPanels();
        if (open) {
          stepsPanel.hidden = false;
          stepsToggle.setAttribute("aria-expanded", "true");
          var wrap = stepsToggle.closest(".nav-dropdown");
          if (wrap) wrap.classList.add("is-open");
        }
      });
    }

    if (mobileBtn && mobilePanel) {
      mobileBtn.addEventListener("click", function () {
        var open = mobilePanel.hidden;
        closeAllPanels();
        if (open) {
          mobilePanel.hidden = false;
          mobileBtn.setAttribute("aria-expanded", "true");
          mobileBtn.setAttribute("aria-label", "关闭菜单");
        } else {
          mobileBtn.setAttribute("aria-label", "打开菜单");
        }
      });
    }

    if (userBtn && userPopover) {
      userBtn.addEventListener("click", function () {
        var open = userPopover.hidden;
        closeAllPanels();
        if (open) {
          userPopover.hidden = false;
          userBtn.setAttribute("aria-expanded", "true");
        }
      });
    }

    var panelLinks = document.querySelectorAll("#steps-panel a, #mobile-panel a, .popover-item[href]");
    for (var j = 0; j < panelLinks.length; j += 1) {
      panelLinks[j].addEventListener("click", function () { closeAllPanels(); });
    }
  }

  /* ---------- 渲染入口 ---------- */
  function render() {
    var route = parseRoute();

    if (route.name === "step") {
      var step = findStep(route.id);
      if (!step) {
        window.location.hash = "#/home";
        return;
      }
      ROOT.innerHTML = renderStepPage(step);
      bindHeader();
    } else {
      ROOT.innerHTML = renderHome();
      bindHeader();
      if (pendingScroll) {
        var target = pendingScroll;
        pendingScroll = null;
        window.requestAnimationFrame(function () { scrollToSection(target); });
      }
    }

    if (!window.location.hash) {
      try {
        window.history.replaceState(null, "", "#/home");
      } catch (e) { /* noop */ }
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    paintVisits();
  }

  /* ---------- 全局事件 ---------- */
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-dropdown")) {
      var panel = document.getElementById("steps-panel");
      var toggle = document.getElementById("steps-toggle");
      if (panel && !panel.hidden) {
        panel.hidden = true;
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        var wrap = toggle && toggle.closest(".nav-dropdown");
        if (wrap) wrap.classList.remove("is-open");
      }
    }
    if (!event.target.closest(".user-wrap")) {
      var popover = document.getElementById("user-popover");
      var userBtn = document.getElementById("user-btn");
      if (popover && !popover.hidden) {
        popover.hidden = true;
        if (userBtn) userBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-scroll]");
    if (!trigger) return;
    event.preventDefault();
    var id = trigger.getAttribute("data-scroll");
    var onHome = parseRoute().name === "home";
    if (onHome) {
      closeAllPanels();
      scrollToSection(id);
    } else {
      pendingScroll = id;
      if (window.location.hash === "#/home") {
        scrollToSection(id);
      } else {
        window.location.hash = "#/home";
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAllPanels();
  });

  window.addEventListener("hashchange", render);
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      var mobile = document.getElementById("mobile-panel");
      if (mobile && !mobile.hidden) {
        mobile.hidden = true;
        var btn = document.getElementById("mobile-menu-btn");
        if (btn) {
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("aria-label", "打开菜单");
        }
      }
    }
  });

  render();
  loadVisits();
})();
