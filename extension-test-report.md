# 扩展控制回归

版本：0.5.2

结果：**PASS 6/6**

真实加载 Manifest V3、使用 Chrome popup/runtime/storage API；host DOM 经测试路由合成。本报告不构成 demo.impact.com 实网或真实 AI 回复验收。

- **PASS** Loaded MV3 isolated content script defaults both independent controls to on: Real unpacked MV3 0.5.2; routed synthetic DOM; original Text and numeric values preserved
- **PASS** Popup AI toggle and page AI toggle synchronize through real storage/runtime events: Popup -> page and page -> popup; AI setting persisted independently of translation
- **PASS** Runtime messages enforce all four translation/AI combinations independently: English+question, Chinese without question, English without question, Chinese+question all verified
- **PASS** Direct storage changes synchronize both UIs and both settings survive page reload: chrome.storage.onChanged updates live page and open popup; reload retains independent settings
- **PASS** Translation-off English term question uses the native shadow editor once: One native input/send event path; original English term preserved; no synthetic assistant reply used
- **PASS** Dragging is memory-only, survives setting changes, and reload restores the default location: Dedicated pointer drag moved assistant; settings did not reposition it; refresh resets 140px bottom without persisting coordinates
