document.addEventListener('DOMContentLoaded', () => {
  const engineList = document.getElementById('engine-list');
  const addEngineBtn = document.getElementById('add-engine-btn');

  // 加载搜索引擎列表
  function loadEngines() {
    // 获取默认引擎和自定义引擎
    const defaultEngines = [
      { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
      { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
      { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' },
      { name: 'Duckduckgo', url: 'https://www.duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
    ];
    const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
    const allEngines = [...defaultEngines, ...customEngines];

    engineList.innerHTML = '';
    allEngines.forEach((engine, index) => {
      const engineItem = document.createElement('div');
      engineItem.className = 'engine-item';
      
      engineItem.innerHTML = `
        <img src="${engine.icon}" class="engine-icon" alt="${engine.name}">
        <span class="engine-name">${engine.name}</span>
        <button class="delete-btn" ${engine.name === 'Google' ? 'disabled' : ''}>
          Delete
        </button>
      `;

      const deleteBtn = engineItem.querySelector('.delete-btn');
      if (!deleteBtn.disabled) {
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete ${engine.name}?`)) {
            if (index >= defaultEngines.length) {
              const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
              customEngines.splice(index - defaultEngines.length, 1);
              localStorage.setItem('customEngines', JSON.stringify(customEngines));
            }
            loadEngines();
          }
        });
      }

      engineList.appendChild(engineItem);
    });
  }

  // 添加新搜索引擎
  addEngineBtn.addEventListener('click', () => {
    const customUrl = prompt("Enter search URL (use {q} as query placeholder):", "https://example.com/search?q={q}");
    if (customUrl) {
      const customName = prompt("Enter search engine name:", "Custom Search");
      if (customName) {
        let customIcon;
        try {
          const url = new URL(customUrl);
          customIcon = `https://www.google.com/s2/favicons?domain=${url.hostname}`;
        } catch {
          customIcon = 'https://www.google.com/s2/favicons?domain=google.com';
        }

        const newEngine = {
          name: customName,
          url: customUrl.replace("{q}", ""),
          icon: customIcon,
        };

        const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
        customEngines.push(newEngine);
        localStorage.setItem('customEngines', JSON.stringify(customEngines));
        loadEngines();
      }
    }
  });

  // 初始加载
  loadEngines();
}); 