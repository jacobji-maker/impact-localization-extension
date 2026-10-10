/** Pure, read-only DOM diagnostic; pass directly to frame.evaluate. No table text or values leave the browser. */
export function inspectFinanceReportStructure() {
  const paths = {
    adv_upcoming_payouts: '/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report',
    adv_cash_flow_recon: '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report',
    adv_gaap_summary_action: '/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report'
  };
  const handles = new URL(location.href).searchParams.getAll('handle');
  const authorizedReport = location.origin === 'https://demo.impact.com' && handles.length === 1 && paths[handles[0]] === location.pathname;
  const safety = { tableTextReturned: false, businessRowsReturned: false, optionValuesReturned: false, inputValuesReturned: false, privateAttributesReturned: false, domModified: false };
  if (!authorizedReport) return { authorizedReport: false, ...safety };

  const visible = element => {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (current.hidden || current.getAttribute('aria-hidden') === 'true' || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    }
    return true;
  };
  // Positional paths never include arbitrary ids, data attributes, hrefs or values.
  const selector = element => {
    const parts = [];
    for (let current = element; current; current = current.parentElement) {
      const siblings = current.parentElement ? [...current.parentElement.children].filter(node => node.tagName === current.tagName) : [current];
      parts.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(current) + 1})`);
    }
    return parts.join(' > ');
  };
  const classNames = element => [...element.classList].filter(value => /^[A-Za-z][A-Za-z_-]*(?:--[A-Za-z0-9]{4,12})?$/u.test(value));
  const describe = element => element ? { tag: element.tagName, classNames: classNames(element), selector: selector(element), visible: visible(element) } : null;
  const ancestry = (element, boundary) => {
    const result = [];
    for (let current = element.parentElement; current && result.length < 8; current = current.parentElement) {
      result.push(describe(current));
      if (current === boundary) break;
    }
    return result;
  };
  const forms = [...document.querySelectorAll('#reportFormDiv')];
  const labels = [];
  const fixedLabels = new Set(['Show:', 'Prediction Range:', 'Funding Account:']);
  for (const form of forms) {
    const walker = document.createTreeWalker(form, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const label = node.nodeValue.trim();
      if (!fixedLabels.has(label)) continue;
      const element = node.parentElement;
      if (!element || element.closest('input,textarea,select,option,[contenteditable],#impact-cn-assistant,#ask-impact-shadow-host') || element.getRootNode() !== document) continue;
      const nearest = element.closest('span,button');
      const control = element.closest('button,[role="button"],span[class*="baseFilterButton"]');
      labels.push({ fixedDirectText: label, parent: describe(element), nearestSpanOrButton: nearest && form.contains(nearest) ? describe(nearest) : null, nativeControl: control && form.contains(control) ? describe(control) : null, ancestors: ancestry(element, form) });
    }
  }
  const containers = [...document.querySelectorAll('.reportContainer--NoSIx')];
  const tables = [...document.querySelectorAll('.reportContainer--NoSIx .reportingTable--bRdjL')];
  const loaderSelector = '.loader--XmNTN,[class*="loader"],[class*="Loader"]';
  const emptySelector = '.empty-state,[class*="empty"],[class*="Empty"]';
  const unique = nodes => [...new Set(nodes)];
  const countStructure = (root, query) => {
    const nodes = [...root.querySelectorAll(query)];
    return { total: nodes.length, visible: nodes.filter(visible).length };
  };
  const tableStructures = tables.map((table, index) => {
    const container = table.closest('.reportContainer--NoSIx');
    const headerNodes = [...table.querySelectorAll('*')].filter(element => [...element.classList].some(value => /header/iu.test(value)));
    const loaders = [...table.querySelectorAll(loaderSelector)];
    const emptyCandidates = [...table.querySelectorAll(emptySelector)].filter(element => !element.closest('td,[role="cell"],.table-cell,.table-row,tbody'));
    const headerClasses = new Map();
    for (const element of headerNodes) {
      const key = JSON.stringify({ tag: element.tagName, classNames: classNames(element) });
      const group = headerClasses.get(key) || { tag: element.tagName, classNames: classNames(element), count: 0, visibleCount: 0 };
      group.count++; if (visible(element)) group.visibleCount++; headerClasses.set(key, group);
    }
    return {
      index, ...describe(table), containerIndex: containers.indexOf(container), ancestors: ancestry(table, container),
      // Direct children only: never enumerate business rows or cells.
      children: [...table.children].map(element => ({ ...describe(element), businessBodyBoundary: element.matches('tbody,[role="rowgroup"],.table-body') })),
      th: countStructure(table, 'th'), columnHeaders: countStructure(table, '[role="columnheader"]'), thead: countStructure(table, 'thead'),
      headerClassNodeCount: headerNodes.length, visibleHeaderClassNodeCount: headerNodes.filter(visible).length, headerClassGroups: [...headerClasses.values()],
      loaderNodeCount: loaders.length, visibleLoaderNodeCount: loaders.filter(visible).length,
      emptyCandidateNodeCount: emptyCandidates.length, visibleEmptyCandidateNodeCount: emptyCandidates.filter(visible).length,
      loaderStructures: loaders.map(describe), emptyCandidateStructures: emptyCandidates.map(describe),
      containsTableIndexes: tables.flatMap((other, otherIndex) => other !== table && table.contains(other) ? [otherIndex] : []),
      containedByTableIndexes: tables.flatMap((other, otherIndex) => other !== table && other.contains(table) ? [otherIndex] : [])
    };
  });
  const allLoaders = unique(containers.flatMap(container => [...container.querySelectorAll(loaderSelector)]));
  const allEmptyCandidates = unique(containers.flatMap(container => [...container.querySelectorAll(emptySelector)])).filter(element => !element.closest('td,[role="cell"],.table-cell,.table-row,tbody'));
  // Separate discovery evidence from the exact observed selectors above. No text is read here.
  // Candidate paths cannot traverse business rows/cells or native conversation/input surfaces.
  const excludedCandidateAncestor = 'tr,td,tbody,[role="row"],[role="cell"],.table-row,.table-cell,.table-body,input,textarea,select,option,[contenteditable],nav,#impact-cn-assistant,#ask-impact-shadow-host,[id^="ask-impact-"]';
  const structuralCandidate = element => !element.closest(excludedCandidateAncestor) && (
    element.matches('table,[role="table"],[role="grid"]') ||
    [...element.classList].some(value => /report(?:ing)?[-_]*(?:table|container)/iu.test(value))
  );
  const discovered = [...document.querySelectorAll('table,[role="table"],[role="grid"],[class]')].filter(structuralCandidate);
  const candidates = discovered.slice(0, 80);
  const documentStructure = {
    readyState: document.readyState, bodyPresent: Boolean(document.body),
    iframeCount: document.querySelectorAll('iframe').length,
    openShadowHostCount: [...document.querySelectorAll('*')].filter(element => Boolean(element.shadowRoot)).length,
    ordinaryDOMOnly: true, candidateNodeCount: discovered.length, visibleCandidateNodeCount: discovered.filter(visible).length,
    returnedCandidateCount: candidates.length, candidatesTruncated: discovered.length > candidates.length,
    candidates: candidates.map((element, index) => {
      const headers = [...element.querySelectorAll('*')].filter(child => [...child.classList].some(value => /header/iu.test(value)));
      const safeChildren = [...element.children].filter(child => !child.matches('tr,td,[role="row"],[role="cell"],.table-row,.table-cell'));
      const loaders = [...element.querySelectorAll(loaderSelector)].filter(child => !child.closest(excludedCandidateAncestor));
      const emptyCandidates = [...element.querySelectorAll(emptySelector)].filter(child => !child.closest(excludedCandidateAncestor));
      const headerGroups = new Map();
      for (const child of headers) {
        const key = JSON.stringify({ tag: child.tagName, classNames: classNames(child) });
        const group = headerGroups.get(key) || { tag: child.tagName, classNames: classNames(child), count: 0, visibleCount: 0 };
        group.count++; if (visible(child)) group.visibleCount++; headerGroups.set(key, group);
      }
      return {
        index, ...describe(element), ancestors: ancestry(element, document.body),
        nativeTable: element.tagName === 'TABLE', roleTable: element.matches('[role="table"]'), roleGrid: element.matches('[role="grid"]'),
        reportingClassCandidate: [...element.classList].some(value => /report(?:ing)?[-_]*(?:table|container)/iu.test(value)),
        children: safeChildren.map(child => ({ ...describe(child), businessBodyBoundary: child.matches('tbody,[role="rowgroup"],.table-body') })),
        omittedDirectBusinessRowOrCellCount: element.children.length - safeChildren.length,
        th: countStructure(element, 'th'), columnHeaders: countStructure(element, '[role="columnheader"]'), thead: countStructure(element, 'thead'),
        headerClassNodeCount: headers.length, visibleHeaderClassNodeCount: headers.filter(visible).length, headerClassGroups: [...headerGroups.values()],
        visibleLoaderNodeCount: loaders.filter(visible).length, visibleEmptyCandidateNodeCount: emptyCandidates.filter(visible).length,
        containsCandidateIndexes: candidates.flatMap((other, otherIndex) => other !== element && element.contains(other) ? [otherIndex] : []),
        containedByCandidateIndexes: candidates.flatMap((other, otherIndex) => other !== element && other.contains(element) ? [otherIndex] : [])
      };
    }),
    businessRowsOrCellsEnumerated: false, textRead: false, arbitraryIdsReturned: false
  };
  return {
    authorizedReport: true, reportPath: location.pathname, reportHandle: handles[0], isTopDocument: window === window.top, ordinaryDOMOnly: true,
    formCount: forms.length, visibleFormCount: forms.filter(visible).length, fixedLabelNodeCount: labels.length, labels,
    containerCount: containers.length, visibleContainerCount: containers.filter(visible).length,
    containers: containers.map((container, index) => ({ index, ...describe(container), tableIndexes: tables.flatMap((table, tableIndex) => container.contains(table) ? [tableIndex] : []) })),
    tableCount: tables.length, visibleTableCount: tables.filter(visible).length, tables: tableStructures,
    visibleLoaderNodeCount: allLoaders.filter(visible).length, visibleEmptyCandidateNodeCount: allEmptyCandidates.filter(visible).length,
    documentStructure,
    emptyCandidatesAreStructuralOnly: true, queryCompletionAssessed: false, ...safety
  };
}
