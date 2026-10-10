"use strict";
const toggle = document.getElementById("enabled");
const aiToggle = document.getElementById("ai-enabled");
const status = document.getElementById("status");
let activeTab;
let lastState;
toggle.disabled = true;
aiToggle.disabled = true;

function renderStatus() {
  const summary = `精细翻译${toggle.checked ? "开启" : "暂停"} · AI辅助${aiToggle.checked ? "开启" : "关闭"}`;
  status.textContent = lastState ? `${summary} · 已翻译 ${lastState.translatedCount} 处` : `${summary}。设置会在 Impact 页面生效。`;
}

async function readPageState() {
  if (activeTab?.id === undefined) return;
  try {
    lastState = await chrome.tabs.sendMessage(activeTab.id, { type: "impact-cn:get-state" });
    renderStatus();
  } catch {
    lastState = undefined;
    renderStatus();
  }
}

async function initialize() {
  const stored = await chrome.storage.local.get(["impactCNEnabled", "impactCNAIEnabled"]);
  toggle.checked = stored.impactCNEnabled !== false;
  aiToggle.checked = stored.impactCNAIEnabled !== false;
  [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await readPageState();
}

async function changeSetting(input, key, messageType) {
  input.disabled = true;
  try {
    await chrome.storage.local.set({ [key]: input.checked });
    try {
      lastState = await chrome.tabs.sendMessage(activeTab.id, { type: messageType, enabled: input.checked });
    } catch { lastState = undefined; }
    renderStatus();
  } catch {
    status.textContent = "浏览器无法保存开关设置，请重试。";
  } finally { input.disabled = false; }
}

toggle.addEventListener("change", () => { void changeSetting(toggle, "impactCNEnabled", "impact-cn:set-enabled"); });
aiToggle.addEventListener("change", () => { void changeSetting(aiToggle, "impactCNAIEnabled", "impact-cn:set-ai-enabled"); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.impactCNEnabled) toggle.checked = changes.impactCNEnabled.newValue !== false;
  if (changes.impactCNAIEnabled) aiToggle.checked = changes.impactCNAIEnabled.newValue !== false;
  renderStatus();
  void readPageState();
});

initialize().catch(() => { status.textContent = "无法读取汉化助手状态，请关闭后重新打开。"; }).finally(() => { toggle.disabled = false; aiToggle.disabled = false; });
