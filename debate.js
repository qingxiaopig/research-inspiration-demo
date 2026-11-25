/* 科研灵感 · 科学假说辩论静态演示
 * 数据来自 preset-data.js（预置辩论任务），页面不发起任何网络请求。
 */
(function () {
  var D = window.DEBATE_DEMO;
  if (!D) return;

  var startBtn = document.getElementById("debate-start");
  var skipBtn = document.getElementById("debate-skip");
  var statusEl = document.getElementById("debate-status");
  var percentEl = document.getElementById("progress-percent");
  var elapsedEl = document.getElementById("progress-elapsed");
  var titleEl = document.getElementById("progress-title");
  var trackEl = document.getElementById("progress-track");
  var fillEl = document.getElementById("progress-fill");
  var stageList = document.getElementById("stage-list");
  var speechList = document.getElementById("speech-list");
  var conclusionBody = document.getElementById("conclusion-body");
  var reportPanel = document.getElementById("report-panel");
  var reportTabs = document.querySelectorAll(".report-tab");

  var STAGES = [
    { pct: 0, label: "议题发起", desc: "接收科研问题，创建辩论任务", elapsed: 0 },
    { pct: 10, label: "辩手就位", desc: "三路提议者与协调者分配模型", elapsed: 5 },
    { pct: 17, label: "联网检索", desc: "检索压电高分子相关参考信息", elapsed: 82 },
    { pct: 33, label: "并行推理", desc: "三位提议者独立构建论证", elapsed: 135 },
    { pct: 50, label: "提议者 1 发言", desc: "Qwen3.7-Max 完成立论", elapsed: 148, reveal: ["p1"] },
    { pct: 67, label: "提议者 2、3 发言", desc: "GLM-5.2 与 MiniMax-M3 完成立论", elapsed: 179, reveal: ["p2", "p3"] },
    { pct: 83, label: "协调者汇总", desc: "汇总共识、分歧与论证质量", elapsed: 340, reveal: ["coord"] },
    { pct: 100, label: "生成报告", desc: "输出结论、假说与完整报告", elapsed: 535, done: true }
  ];

  var started = false;
  var finished = false;
  var timers = [];
  var reportCache = {};

  /* ---------- Markdown 渲染（轻量、本地、无第三方依赖） ---------- */
  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 预置报告里夹带了少量 <em> 与 HTML 实体，先归一化，再统一转义。 */
  function cleanSource(md) {
    return String(md)
      .replace(/<\/?em>/gi, "")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&")
      .replace(/\r\n/g, "\n");
  }

  function inline(text) {
    var s = esc(text);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    s = s.replace(/\$([^$\n]+)\$/g, '<span class="math-inline">$1</span>');
    return s;
  }

  function isBlockStart(line) {
    return /^\s*$/.test(line) ||
      /^#{1,6}\s+/.test(line) ||
      /^```/.test(line) ||
      /^\s*>\s?/.test(line) ||
      /^\s*([-*])\s+/.test(line) ||
      /^\s*\d+[.)]\s+/.test(line) ||
      /^\s*(---+|\*\*\*+)\s*$/.test(line) ||
      /^\s*\|/.test(line);
  }

  function splitCells(line) {
    var body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return body.split("|").map(function (cell) { return cell.trim(); });
  }

  function renderTable(lines, start) {
    var headers = splitCells(lines[start]);
    var rows = [];
    var i = start + 2;
    while (i < lines.length && /^\s*\|/.test(lines[i])) {
      rows.push(splitCells(lines[i]));
      i += 1;
    }
    var html = '<div class="md-table-wrap"><table><thead><tr>';
    headers.forEach(function (cell) { html += "<th>" + inline(cell) + "</th>"; });
    html += "</tr></thead><tbody>";
    rows.forEach(function (row) {
      html += "<tr>";
      headers.forEach(function (_, index) { html += "<td>" + inline(row[index] || "") + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return { html: html, next: i };
  }

  function renderList(lines, start) {
    var ordered = /^\s*\d+[.)]\s+/.test(lines[start]);
    var marker = ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/;
    var items = [];
    var i = start;
    var current = null;
    while (i < lines.length) {
      var line = lines[i];
      if (marker.test(line)) {
        if (current !== null) items.push(current);
        current = line.replace(marker, "");
      } else if (current !== null && /^\s+\S/.test(line) && !isBlockStart(line)) {
        current += "<br>" + line.trim();
      } else {
        break;
      }
      i += 1;
    }
    if (current !== null) items.push(current);
    var tag = ordered ? "ol" : "ul";
    var html = "<" + tag + ">";
    items.forEach(function (item) { html += "<li>" + inline(item) + "</li>"; });
    html += "</" + tag + ">";
    return { html: html, next: i };
  }

  function renderMarkdown(md) {
    var lines = cleanSource(md).split("\n");
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];

      if (/^\s*$/.test(line)) { i += 1; continue; }

      if (/^```/.test(line)) {
        var code = [];
        i += 1;
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i += 1; }
        i += 1;
        out.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
        continue;
      }

      var heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        var level = heading[1].length;
        out.push('<h' + level + ' class="md-h">' + inline(heading[2]) + "</h" + level + ">");
        i += 1;
        continue;
      }

      if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
        out.push("<hr>");
        i += 1;
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        var quoted = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quoted.push(lines[i].replace(/^\s*>\s?/, ""));
          i += 1;
        }
        out.push("<blockquote>" + inline(quoted.join("<br>")) + "</blockquote>");
        continue;
      }

      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
        var table = renderTable(lines, i);
        out.push(table.html);
        i = table.next;
        continue;
      }

      if (/^\s*([-*])\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
        var list = renderList(lines, i);
        out.push(list.html);
        i = list.next;
        continue;
      }

      var para = [];
      while (i < lines.length && !isBlockStart(lines[i])) {
        para.push(lines[i]);
        i += 1;
        if (i < lines.length && /^\s*$/.test(lines[i])) break;
      }
      if (!para.length) { i += 1; continue; }
      out.push("<p>" + inline(para.join("<br>")) + "</p>");
    }
    return out.join("\n");
  }

  function sectionBetween(md, startMark, endMark) {
    var source = cleanSource(md);
    var start = source.indexOf(startMark);
    if (start < 0) return "";
    var end = source.indexOf(endMark, start + startMark.length);
    if (end < 0) end = source.length;
    return source.slice(start, end);
  }

  /* ---------- 页面静态内容 ---------- */
  var full = D.reports.full;
  var brief = D.reports.brief;

  var roleCards = [
    {
      id: "p1",
      avatar: "提",
      role: "提议者 1",
      model: "Qwen3.7-Max",
      tag: "支持 · 纯有机路线",
      content: D.steps[0].content,
      note: ""
    },
    {
      id: "p2",
      avatar: "提",
      role: "提议者 2",
      model: "GLM-5.2",
      tag: "支持 · 工程折中",
      content: D.steps[1].content,
      note: ""
    },
    {
      id: "p3",
      avatar: "提",
      role: "提议者 3",
      model: "MiniMax-M3",
      tag: "有条件支持 · 证据分级",
      content: sectionBetween(full, "### debate-3 的论证质量", "\n---"),
      note: "预置数据中该角色的原始输出为英文推理草稿，这里展示协调者对其论证的归纳，避免直接呈现未完成的草稿。"
    },
    {
      id: "coord",
      avatar: "协",
      role: "协调者",
      model: "DeepSeek-V4-Pro",
      tag: "汇总评判 · 假说生成",
      content: sectionBetween(full, "### 当前最可信的结论", "## 收敛评估"),
      note: "以下为预置报告中的协调者综合结论原文。"
    }
  ];

  function fmtDuration(seconds) {
    var num = Number(seconds) || 0;
    var min = Math.floor(num / 60);
    var sec = num % 60;
    return min > 0 ? min + " 分 " + sec + " 秒" : sec + " 秒";
  }

  function buildMeta() {
    document.getElementById("debate-goal").textContent = "「" + D.meta.goal + "」";
    var meta = document.getElementById("debate-meta");
    var items = [
      ["辩论模式", D.meta.mode],
      ["数据时间", D.meta.completed_at],
      ["总耗时", fmtDuration(D.meta.elapsed_seconds)],
      ["任务标识", String(D.meta.task_id).slice(0, 8)]
    ];
    meta.innerHTML = items.map(function (item) {
      return '<span class="meta-chip"><small>' + esc(item[0]) + "</small><b>" + esc(item[1]) + "</b></span>";
    }).join("");
  }

  function buildStages() {
    stageList.innerHTML = STAGES.map(function (stage, index) {
      return '<li class="stage-item is-pending" data-stage="' + index + '">' +
        '<span class="stage-dot">' + (index + 1) + "</span>" +
        '<span class="stage-copy"><strong>' + esc(stage.label) + "</strong><small>" + esc(stage.desc) + "</small></span>" +
        '<span class="stage-time">' + stage.elapsed + "s</span>" +
        "</li>";
    }).join("");
  }

  function buildSpeeches() {
    speechList.innerHTML = roleCards.map(function (card) {
      var long = card.content.length > 800;
      return '<article class="speech-card" data-speech="' + card.id + '" hidden>' +
        '<header class="speech-head">' +
        '<span class="speech-avatar">' + esc(card.avatar) + "</span>" +
        '<div class="speech-id"><strong>' + esc(card.role) + ' <span class="speech-model">' + esc(card.model) + "</span></strong>" +
        '<small>' + esc(card.tag) + "</small></div>" +
        '<span class="speech-state">发言完成</span>' +
        "</header>" +
        (card.note ? '<p class="speech-note">' + esc(card.note) + "</p>" : "") +
        '<div class="speech-body md-body' + (long ? " is-collapsed" : "") + '">' + renderMarkdown(card.content) + "</div>" +
        (long ? '<button class="speech-toggle" type="button">展开全文</button>' : "") +
        "</article>";
    }).join("");

    var toggles = speechList.querySelectorAll(".speech-toggle");
    for (var i = 0; i < toggles.length; i += 1) {
      toggles[i].addEventListener("click", function () {
        var body = this.parentNode.querySelector(".speech-body");
        var collapsed = body.classList.toggle("is-collapsed");
        this.textContent = collapsed ? "展开全文" : "收起";
      });
    }
  }

  function setProgress(index) {
    var stage = STAGES[index];
    fillEl.style.width = stage.pct + "%";
    percentEl.textContent = stage.pct + "%";
    elapsedEl.textContent = "已用时 " + stage.elapsed + " 秒";
    trackEl.setAttribute("aria-valuenow", String(stage.pct));
    titleEl.textContent = stage.label;

    var items = stageList.querySelectorAll(".stage-item");
    for (var i = 0; i < items.length; i += 1) {
      items[i].classList.remove("is-active", "is-done", "is-pending");
      if (i < index) items[i].classList.add("is-done");
      else if (i === index) items[i].classList.add("is-active");
      else items[i].classList.add("is-pending");
    }
  }

  function reveal(ids) {
    (ids || []).forEach(function (id) {
      var card = speechList.querySelector('[data-speech="' + id + '"]');
      if (!card || !card.hidden) return;
      card.hidden = false;
      card.classList.add("is-entering");
      window.setTimeout(function () { card.classList.remove("is-entering"); }, 600);
    });
  }

  function renderConclusion() {
    var stats = [
      ["总轮次", D.summary.rounds + " 轮"],
      ["是否收敛", D.summary.converged ? "是" : "否"],
      ["收敛阈值", String(D.summary.threshold || 0.8)],
      ["总耗时", fmtDuration(D.meta.elapsed_seconds)],
      ["假说数量", "3 条"]
    ];
    var conclusionText = sectionBetween(full, "### 当前最可信的结论", "## 收敛评估");
    var hypotheses = sectionBetween(brief, "## 🔬 假说结论", "\n---");

    conclusionBody.innerHTML =
      '<div class="conclusion-card">' +
      '<div class="conclusion-top"><span class="conclusion-badge">协调者结论</span>' +
      '<div class="conclusion-stats">' + stats.map(function (item) {
        return '<span><b>' + esc(item[1]) + "</b><small>" + esc(item[0]) + "</small></span>";
      }).join("") + "</div></div>" +
      '<div class="md-body">' + renderMarkdown(conclusionText) + "</div>" +
      '<div class="hypothesis-block"><div class="hypothesis-head"><span>可验证假说</span><small>来自精简报告</small></div>' +
      '<div class="md-body">' + renderMarkdown(hypotheses) + "</div></div>" +
      "</div>";
  }

  function renderReport(kind) {
    if (reportCache[kind]) {
      reportPanel.innerHTML = reportCache[kind];
      return;
    }
    var note = kind === "full"
      ? '<p class="report-disclaimer">完整报告保留预置原文；其中提议者 3 的段落为模型推理草稿（英文），仅作示例。</p>'
      : "";
    var html = note + '<div class="md-body report-md">' + renderMarkdown(kind === "full" ? full : brief) + "</div>";
    reportCache[kind] = html;
    reportPanel.innerHTML = html;
  }

  function finish() {
    started = true;
    finished = true;
    timers.forEach(window.clearTimeout);
    timers = [];
    setProgress(STAGES.length - 1);
    roleCards.forEach(function (card) { reveal([card.id]); });
    renderConclusion();
    renderReport("brief");
    renderReport("full");
    switchTab("brief");
    statusEl.textContent = "演示完成 · 内容为预置示例";
    startBtn.textContent = "重新演示";
    startBtn.disabled = false;
    skipBtn.hidden = true;
    document.getElementById("speeches-section").classList.add("is-ready");
    document.getElementById("conclusion-section").classList.add("is-ready");
    document.getElementById("report-section").classList.add("is-ready");
  }

  function reset() {
    timers.forEach(window.clearTimeout);
    timers = [];
    started = false;
    finished = false;
    setProgress(0);
    roleCards.forEach(function (card) {
      var el = speechList.querySelector('[data-speech="' + card.id + '"]');
      if (el) el.hidden = true;
    });
    conclusionBody.innerHTML = '<div class="result-placeholder" id="conclusion-placeholder">辩论完成后在此展示结论。</div>';
    reportPanel.innerHTML = '<div class="result-placeholder">辩论完成后在此展示报告。</div>';
    reportCache = {};
    statusEl.textContent = "演示进行中…";
    startBtn.textContent = "发起辩论演示";
    startBtn.disabled = false;
    skipBtn.hidden = false;
    document.getElementById("speeches-section").classList.remove("is-ready");
    document.getElementById("conclusion-section").classList.remove("is-ready");
    document.getElementById("report-section").classList.remove("is-ready");
    switchTab("brief");
  }

  function run() {
    var index = 0;
    function tick() {
      setProgress(index);
      var stage = STAGES[index];
      if (stage.reveal) reveal(stage.reveal);
      statusEl.textContent = "进度 " + stage.pct + "% · " + stage.label;
      if (stage.done) {
        finished = true;
        renderConclusion();
        renderReport("brief");
        renderReport("full");
        switchTab("brief");
        statusEl.textContent = "演示完成 · 内容为预置示例";
        startBtn.textContent = "重新演示";
        startBtn.disabled = false;
        skipBtn.hidden = true;
        document.getElementById("speeches-section").classList.add("is-ready");
        document.getElementById("conclusion-section").classList.add("is-ready");
        document.getElementById("report-section").classList.add("is-ready");
        return;
      }
      index += 1;
      timers.push(window.setTimeout(tick, index === 1 ? 500 : 1150));
    }
    tick();
  }

  function switchTab(kind) {
    for (var i = 0; i < reportTabs.length; i += 1) {
      var tab = reportTabs[i];
      var active = tab.getAttribute("data-report") === kind;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }
    reportPanel.setAttribute("aria-labelledby", kind === "full" ? "tab-full" : "tab-brief");
    if (finished) renderReport(kind);
  }

  startBtn.addEventListener("click", function () {
    if (started && !finished) return;
    reset();
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = "演示进行中…";
    run();
  });

  skipBtn.addEventListener("click", finish);

  for (var t = 0; t < reportTabs.length; t += 1) {
    reportTabs[t].addEventListener("click", function () {
      switchTab(this.getAttribute("data-report"));
    });
  }

  buildMeta();
  buildStages();
  buildSpeeches();
  setProgress(0);
})();
