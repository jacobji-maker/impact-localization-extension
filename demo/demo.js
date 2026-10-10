/* Demo host application. The localization engine is the actual extension content.js. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const dictionary = globalThis.IMPACT_CN_DICTIONARY;
  const extensionMode = new URLSearchParams(location.search).get("extension") === "1";
  const partners = [
    { name: "North Studio", initials: "N", type: "Content partner", status: "Active", clicks: 12840, actions: 428, revenue: 31200, payout: 2496, color: "#e8eddf", ink: "#778657" },
    { name: "Sunday Edit", initials: "se", type: "Creator", status: "Active", clicks: 9650, actions: 312, revenue: 24800, payout: 1984, color: "#f0e8df", ink: "#a28a73" },
    { name: "Good Things", initials: "g.", type: "Affiliate partner", status: "Active", clicks: 8120, actions: 265, revenue: 18400, payout: 1472, color: "#e5eae7", ink: "#7b9383" },
    { name: "Field Notes", initials: "fn", type: "Content partner", status: "Active", clicks: 6280, actions: 279, revenue: 12020, payout: 961.6, color: "#e9e6ef", ink: "#9284a0" },
    { name: "Everyday Club", initials: "ec", type: "Affiliate partner", status: "Pending approval", clicks: 0, actions: 0, revenue: 0, payout: 0, color: "#f2ecdd", ink: "#a49b71" },
    { name: "Mono Collective", initials: "m", type: "Creator", status: "Pending approval", clicks: 0, actions: 0, revenue: 0, payout: 0, color: "#e8eaec", ink: "#8b9298" }
  ];
  let group = "all";
  let statusFilter = "all";
  let currentView = "partners";
  let sending = false;
  let toastTimer;
  let drawerReturnFocus;
  let lastState = { enabled: true, translatedCount: 0 };
  const labels = { partners: "合作伙伴", overview: "总览", contracts: "合作合同", reports: "数据报告", finance: "财务" };
  const money = (value) => "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function icon(id) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + id);
    svg.append(use);
    return svg;
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").hidden = false;
    toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 3800);
  }
  function updateState(state) {
    lastState = state;
    $("#language-toggle").setAttribute("aria-pressed", String(state.enabled));
    $("#language-label").textContent = state.enabled ? "精细汉化已开启" : "查看英文原文";
    $("#translation-count").textContent = state.enabled ? `已校准 ${state.translatedCount} 处文本` : "汉化已暂停";
    $("#banner-title").textContent = state.enabled ? "让每个功能，都清楚一点。" : "正在查看英文原文。";
    $("#banner-description").textContent = state.enabled ? "专业术语精细校准 · 动态内容实时汉化 · 官方文档随时可查" : "打开汉化开关，即可对照准确中文；你输入的内容始终保留。";
  }
  document.addEventListener("impact-cn:state", (event) => updateState(event.detail));
  document.addEventListener("impact-cn:assistant", (event) => {
    if (event.detail.type === "error") toast(event.detail.message);
  });
  $("#language-toggle").addEventListener("click", async () => {
    if (globalThis.ImpactCN) updateState(await globalThis.ImpactCN.setEnabled(!lastState.enabled));
    else toast("请点击 Chrome 工具栏中的 Impact 中文插件切换汉化。");
  });

  function renderPartners() {
    const query = $("#partner-search").value.trim().toLowerCase();
    const active = partners.filter((partner) => partner.status === "Active");
    const pending = partners.filter((partner) => partner.status === "Pending approval");
    $("#partner-total").textContent = partners.length;
    $("#partner-active").textContent = active.length;
    $("#partner-pending").textContent = pending.length;
    $(".nav-count").textContent = partners.length;
    $("#metric-partners").replaceChildren(document.createTextNode(String(active.length)), el("span", "位", "metric-unit"));
    $("#metric-partners .metric-unit").setAttribute("data-impact-cn-ignore", "");
    const filtered = partners.filter((partner) => {
      if (group === "active" && partner.status !== "Active") return false;
      if (group === "pending" && partner.status !== "Pending approval") return false;
      if (statusFilter !== "all" && partner.status !== statusFilter) return false;
      return partner.name.toLowerCase().includes(query);
    });
    const rows = [];
    for (const partner of filtered) {
      const row = el("tr");
      const nameCell = el("td");
      const identity = el("div", undefined, "partner-identity");
      const avatar = el("div", partner.initials, "partner-avatar");
      avatar.setAttribute("data-impact-user-content", "");
      avatar.style.setProperty("--avatar-bg", partner.color);
      avatar.style.setProperty("--avatar-ink", partner.ink);
      const nameBlock = el("div");
      const name = el("strong", partner.name);
      name.setAttribute("data-impact-user-content", "");
      nameBlock.append(name, el("small", partner.type));
      identity.append(avatar, nameBlock);
      nameCell.append(identity);
      const statusCell = el("td");
      statusCell.append(el("span", partner.status, "status-badge" + (partner.status !== "Active" ? " pending" : "")));
      row.append(nameCell, statusCell, el("td", partner.clicks.toLocaleString("en-US")), el("td", partner.actions.toLocaleString("en-US")), el("td", money(partner.revenue)), el("td", money(partner.payout)));
      const actionCell = el("td");
      const actionButton = el("button", undefined, "row-action");
      actionButton.type = "button";
      actionButton.setAttribute("aria-label", `查看 ${partner.name} 的合同`);
      actionButton.setAttribute("title", "查看合同");
      actionButton.append(icon("arrow"));
      actionButton.addEventListener("click", () => openContract(partner));
      actionCell.append(actionButton);
      row.append(actionCell);
      rows.push(row);
    }
    if (!filtered.length) {
      const row = el("tr");
      const cell = el("td", "No partners found", "empty-cell");
      cell.colSpan = 7;
      row.append(cell);
      rows.push(row);
    }
    $("#partner-rows").replaceChildren(...rows);
    $("#row-count").textContent = `显示 ${filtered.length} 位合作伙伴，共 ${partners.length} 位`;
  }
  for (const [id, nextGroup] of [["tab-all", "all"], ["tab-active", "active"], ["tab-pending", "pending"]]) {
    $("#" + id).addEventListener("click", () => {
      group = nextGroup;
      document.querySelectorAll(".table-tab").forEach((button) => {
        button.classList.toggle("selected", button.id === id);
        button.setAttribute("aria-selected", String(button.id === id));
      });
      renderPartners();
    });
  }
  $("#partner-search").addEventListener("input", renderPartners);
  $("#filter-button").addEventListener("click", () => {
    const menu = $("#filter-menu");
    if (!menu.hidden) { closeFilter(); return; }
    const options = [["all", "All statuses"], ["Active", "Active"], ["Pending approval", "Pending approval"]];
    menu.setAttribute("role", "menu");
    menu.replaceChildren(...options.map(([value, label]) => {
      const button = el("button", label);
      button.type = "button";
      button.setAttribute("role", "menuitemradio");
      button.setAttribute("aria-checked", String(value === statusFilter));
      if (value === statusFilter) button.append(icon("check"));
      button.addEventListener("click", () => { statusFilter = value; renderPartners(); closeFilter(); });
      return button;
    }));
    menu.hidden = false;
    $("#filter-button").setAttribute("aria-expanded", "true");
  });
  function closeFilter() { $("#filter-menu").hidden = true; $("#filter-button").setAttribute("aria-expanded", "false"); }
  document.addEventListener("click", (event) => { if (!event.target.closest(".filter-wrapper")) closeFilter(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeFilter(); closeAI(); } });

  $("#add-partner").addEventListener("click", () => $("#partner-dialog").showModal());
  document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  }));
  $("#invite-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#invite-name").value.trim();
    if (!name) { $("#invite-name").setCustomValidity("请输入合作伙伴名称"); $("#invite-name").reportValidity(); return; }
    partners.push({ name, email: $("#invite-email").value.trim(), initials: Array.from(name).slice(0, 2).join(""), type: $("#invite-type").value, status: "Pending approval", clicks: 0, actions: 0, revenue: 0, payout: 0, color: "#e9edde", ink: "#7a8f63" });
    group = "all";
    statusFilter = "all";
    $("#partner-search").value = "";
    $("#tab-all").click();
    $("#partner-dialog").close();
    $("#invite-form").reset();
    toast(`已添加演示合作伙伴「${name}」。没有发送真实邀请。`);
  });
  $("#invite-name").addEventListener("input", () => $("#invite-name").setCustomValidity(""));
  $("#export-partners").addEventListener("click", () => {
    const csvCell = (value) => '"' + String(value).replace(/^[=+\-@\t\r]/, (prefix) => "'" + prefix).replaceAll('"', '""') + '"';
    const columns = lastState.enabled ? ["合作伙伴", "状态", "点击次数", "转化记录", "销售额", "佣金金额"] : ["Partner", "Status", "Clicks", "Actions", "Revenue", "Payout"];
    const rows = partners.map((partner) => [partner.name, partner.status, partner.clicks, partner.actions, partner.revenue, partner.payout]);
    const csv = "\uFEFF" + [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = el("a");
    link.href = url;
    link.download = "impact-demo-partners.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("已导出演示数据 CSV。");
  });
  let dateIndex = 0;
  $("#date-filter").addEventListener("click", () => {
    dateIndex = (dateIndex + 1) % 3;
    $("#date-label").textContent = ["Last 30 days", "This month", "Today"][dateIndex];
    const values = [[1284, 86420, 6913.6], [728, 52100, 4168], [48, 3360, 268.8]][dateIndex];
    $("#metric-actions").textContent = values[0].toLocaleString("en-US");
    $("#metric-revenue").textContent = money(values[1]);
    $("#metric-payout").textContent = money(values[2]);
    toast(["正在显示近 30 天的模拟数据。", "正在显示本月的模拟数据。", "正在显示今天的模拟数据。"][dateIndex]);
  });

  function contractContent(partner) {
    const container = el("div");
    const title = el("h3", partner.name, "contract-title");
    title.setAttribute("data-impact-user-content", "");
    const subtitle = el("p", "示例合作合同 · 所有条款为演示设定", "contract-partner");
    subtitle.setAttribute("data-impact-cn-ignore", "");
    const fields = el("div", undefined, "contract-fields");
    for (const [source, value, note] of [
      ["Default Payout", "销售额的 8%", "默认佣金比例不表示每笔转化已支付。"],
      ["Action Locking", "转化发生后 30 天", "锁定前品牌可以核查、修改或撤销转化。"],
      ["Referral Window", "点击后 30 天", "决定一次转化是否仍在有效的归因窗口内。"],
      ["Payout Scheduling", "锁定后 20 天", "支付还需满足资金、税务与账户条件。"]
    ]) {
      const field = el("div", undefined, "contract-field");
      const strong = el("strong", value);
      strong.setAttribute("data-impact-cn-ignore", "");
      const description = el("p", note);
      description.setAttribute("data-impact-cn-ignore", "");
      field.append(el("span", source), strong, description);
      fields.append(field);
    }
    const notice = el("p", "“已批准”与“已锁定”是不同状态。上述时间是演示示例，真实安排请查看对应品牌的合同。", "contract-notice");
    notice.setAttribute("data-impact-cn-ignore", "");
    container.append(title, subtitle, fields, notice);
    return container;
  }
  function openContract(partner) { $("#contract-detail").replaceChildren(contractContent(partner)); $("#contract-dialog").showModal(); }
  $("#contract-summary").append(contractContent(partners[0]));
  $("#contract-ask").addEventListener("click", () => { $("#contract-dialog").close(); void askTopic("contracts"); });
  function navigate(view) {
    if (!labels[view]) return;
    currentView = view;
    document.querySelectorAll(".view-panel").forEach((panel) => { panel.hidden = panel.id !== view + "-view"; });
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === view);
      if (button.dataset.view === view) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    $("#breadcrumb-current").textContent = labels[view];
    history.replaceState(null, "", location.pathname + location.search + "#" + view);
  }
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
  document.querySelectorAll("[data-navigate]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.navigate)));

  function renderGlossary() {
    const query = $("#glossary-search").value.trim().toLowerCase();
    const entries = dictionary.entries.filter((entry) => [entry.source, entry.target, entry.reason, ...(entry.aliases || [])].join(" ").toLowerCase().includes(query));
    $("#glossary-entries").replaceChildren(...entries.map((entry) => {
      const block = el("article", undefined, "glossary-entry");
      const mapping = el("div", undefined, "glossary-mapping");
      mapping.append(el("span", entry.source, "glossary-source"), el("span", "→", "glossary-arrow"), el("span", entry.target, "glossary-target"));
      block.append(mapping, el("p", entry.reason));
      if (entry.helpUrl) {
        const link = el("a", "查看官方文档 ↗");
        link.href = entry.helpUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        block.append(link);
      }
      return block;
    }));
    if (!entries.length) $("#glossary-entries").append(el("p", "没有匹配的词条。", "glossary-entry"));
    const reviewed = dictionary.entries.filter((entry) => entry.reviewStatus === "reviewed").length;
    $("#glossary-footer").textContent = `v${dictionary.version} · 共 ${dictionary.entries.length} 个词条，${reviewed} 个已核对官方语义。已核对语义不代表真实账户页面已经适配。当前显示 ${entries.length} 个词条。`;
  }
  function openGlossary() { renderGlossary(); $("#glossary-dialog").showModal(); }
  for (const id of ["glossary-open", "sidebar-glossary"]) $("#" + id).addEventListener("click", openGlossary);
  $("#glossary-search").addEventListener("input", renderGlossary);

  function openAI() {
    if (!$("#ai-panel").hidden) return;
    drawerReturnFocus = document.activeElement;
    $("#ai-panel").hidden = false;
    $("#ai-backdrop").hidden = false;
    $("#ai-input").focus();
  }
  function closeAI() {
    if ($("#ai-panel").hidden) return;
    $("#ai-panel").hidden = true;
    $("#ai-backdrop").hidden = true;
    drawerReturnFocus?.focus();
  }
  $("#ai-open").addEventListener("click", openAI);
  $("#ai-close").addEventListener("click", closeAI);
  $("#ai-backdrop").addEventListener("click", closeAI);
  function findTopic(id) { return dictionary.helpTopics.find((topic) => topic.id === id); }
  async function askTopic(id) {
    openAI();
    if (globalThis.ImpactCN) {
      const result = await globalThis.ImpactCN.askTopic(id);
      if (!result.ok && result.reason !== "busy") toast("发送未完成，请检查问答框中的草稿和插件提示。");
    } else {
      // Extension mode: use the actual injected button, even though its JS lives in an isolated world.
      const button = document.querySelector(`#impact-cn-assistant [data-topic-id="${id}"]`) || Array.from(document.querySelectorAll("#impact-cn-assistant button")).find((node) => node.textContent.trim() === findTopic(id)?.label);
      if (button) button.click();
      else toast("请展开右下角插件的功能引导，点击对应问题。");
    }
  }
  for (const topic of dictionary.helpTopics) {
    const button = el("button", topic.label);
    button.type = "button";
    button.append(icon("arrow"));
    button.addEventListener("click", () => { void askTopic(topic.id); });
    $("#ai-suggestions").append(button);
  }
  $("#explain-action").addEventListener("click", () => { void askTopic("actions"); });
  document.querySelectorAll("[data-ask]").forEach((button) => button.addEventListener("click", () => { void askTopic(button.dataset.ask); }));
  $("#ai-input").addEventListener("input", () => { $("#ai-send").disabled = sending || !$("#ai-input").value.trim(); });
  $("#ai-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); $("#ai-form").requestSubmit(); }
  });
  $("#ai-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const question = $("#ai-input").value.trim();
    if (sending || !question) return;
    sending = true;
    $("#ai-send").disabled = true;
    const messages = $("#ai-messages");
    $(".assistant-welcome")?.remove();
    messages.append(el("div", question, "message user"));
    $("#ai-input").value = "";
    $("#ai-input").dispatchEvent(new Event("input", { bubbles: true }));
    const typing = el("div", "正在整理功能说明…", "message assistant typing");
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
      let topic = dictionary.helpTopics.find((item) => question.includes(item.helpUrl));
      if (!topic) {
        const id = /锁定|lock/i.test(question) ? "locking" : /佣金|付款|支付|payout|payment/i.test(question) ? "payout" : /合同|归因|contract/i.test(question) ? "contracts" : /转化|动作|action/i.test(question) ? "actions" : null;
        topic = id ? findTopic(id) : null;
      }
      const answer = el("div", undefined, "message assistant");
      answer.setAttribute("data-impact-ai-answer", "");
      answer.append(el("strong", topic?.label || "先从一个具体功能开始"));
      answer.append(el("p", topic?.explanation || "这是一个本地问答流程演示。可以问我转化记录、转化锁定期、佣金支付流程或合作合同；其他问题请查阅官方帮助中心。"));
      const link = el("a", "Impact 官方帮助文档");
      link.href = topic?.helpUrl || "https://help.impact.com/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.append(icon("external"));
      answer.append(link);
      typing.replaceWith(answer);
      messages.scrollTop = messages.scrollHeight;
      sending = false;
      $("#ai-send").disabled = !$("#ai-input").value.trim();
      document.dispatchEvent(new CustomEvent("impact-demo:reply", { detail: { topic: topic?.id, helpUrl: link.href } }));
    }, 600);
  });

  renderPartners();
  if (labels[location.hash.slice(1)]) navigate(location.hash.slice(1));
  if (extensionMode) {
    $("#language-label").textContent = "扩展加载模式";
    $("#language-toggle").title = "使用 Chrome 插件弹出页切换汉化";
  } else {
    const script = el("script");
    script.src = "../impact-cn-mod/content.js";
    script.onload = async () => { if (globalThis.ImpactCN) { await globalThis.ImpactCN.ready; updateState(globalThis.ImpactCN.getState()); } };
    script.onerror = () => { toast("插件脚本加载失败，请使用本地 HTTP 服务打开 demo。"); $("#translation-count").textContent = "加载失败"; };
    document.head.append(script);
  }
})();
