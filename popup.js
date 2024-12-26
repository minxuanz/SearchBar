document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box");
  const searchIcon = document.getElementById("search-icon");
  const upIcon = document.getElementById("up-icon");
  const downIcon = document.getElementById("down-icon");
  const enginesDropdown = document.getElementById("engines-dropdown");

  let engines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' },
    { name: 'Duckduckgo', url: 'https://www.duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  // Load current engine index from localStorage or default to 0
  let currentEngineIndex = localStorage.getItem('currentEngineIndex');
  if (currentEngineIndex === null) {
    currentEngineIndex = 0;
  } else {
    currentEngineIndex = parseInt(currentEngineIndex, 10);
  }

  // Load custom engines from localStorage
  const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
  engines = engines.concat(customEngines);

  function updateSearchEngine() {
    const engine = engines[currentEngineIndex];
    searchIcon.src = engine.icon;
    searchBox.placeholder = `Search with ${engine.name}`;
    localStorage.setItem('currentEngineIndex', currentEngineIndex);
  }
  
  upIcon.addEventListener('click', () => {
    currentEngineIndex = (currentEngineIndex - 1 + engines.length) % engines.length;
    updateSearchEngine();
  });

  downIcon.addEventListener('click', () => {
    currentEngineIndex = (currentEngineIndex + 1) % engines.length;
    updateSearchEngine();
  });

  searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && searchBox.value.trim() !== "") {
      const query = searchBox.value.trim();
      const engine = engines[currentEngineIndex];
      window.open(`${engine.url}${encodeURIComponent(query)}`, "_blank");
      searchBox.value = ""; // Clear the input
    }
  });

  function createEnginesDropdown() {
    enginesDropdown.innerHTML = '';
    
    // 添加引擎
    engines.forEach((engine, index) => {
      if (index !== currentEngineIndex) {
        const engineItem = document.createElement('div');
        engineItem.className = 'engine-item';
        engineItem.title = engine.name;
        
        // 创建引擎图标
        const engineIcon = document.createElement('img');
        engineIcon.src = engine.icon;
        engineIcon.alt = engine.name;
        
        // 只为非 Google 引擎添加删除按钮
        if (engine.name !== 'Google') {
          const removeIcon = document.createElement('div');
          removeIcon.className = 'remove-icon';
          engineItem.appendChild(removeIcon);
          
          removeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const confirmed = confirm("Are you sure you want to delete this search engine?");
            if (confirmed) {
              const customIndex = index - (engines.length - customEngines.length);
              customEngines.splice(customIndex, 1);
              engines.splice(index, 1);
              localStorage.setItem('customEngines', JSON.stringify(customEngines));
              if (currentEngineIndex > index) {
                currentEngineIndex--;
              }
              updateSearchEngine();
              createEnginesDropdown();
            }
          });
        }
        
        engineItem.appendChild(engineIcon);
        
        engineItem.addEventListener('click', () => {
          currentEngineIndex = index;
          updateSearchEngine();
          toggleDropdown(false);
        });
        
        enginesDropdown.appendChild(engineItem);
      }
    });

    // 添加分隔线
    const separator = document.createElement('div');
    separator.style.width = '1px';
    separator.style.height = '20px';
    separator.style.backgroundColor = '#dfe1e5';
    separator.style.margin = '0 4px';
    enginesDropdown.appendChild(separator);

    // 添加"添加引擎"按钮
    const addItem = document.createElement('div');
    addItem.className = 'engine-item';
    addItem.title = 'Add custom engine';
    addItem.innerHTML = `
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E" class="add-icon">
    `;
    addItem.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(false);
      // 使用原来的添加引擎逻辑
      const customUrl = prompt("Enter the search URL (use {q} for query placeholder):", "https://github.com/search?q=");
      if (customUrl) {
        const customName = prompt("Enter a name for this search engine:", "Custom Engine");
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

        engines.push(newEngine);
        customEngines.push(newEngine);
        localStorage.setItem('customEngines', JSON.stringify(customEngines));
        currentEngineIndex = engines.length - 1;
        updateSearchEngine();
      }
    });
    enginesDropdown.appendChild(addItem);
  }

  function toggleDropdown(show) {
    console.log('toggleDropdown called', show); // 添加调试日志
    if (show === undefined) {
      if (!enginesDropdown.classList.contains('show')) {
        createEnginesDropdown(); // 在显示之前更新内容
      }
      enginesDropdown.classList.toggle('show');
    } else {
      if (show) {
        createEnginesDropdown();
        enginesDropdown.classList.add('show');
      } else {
        enginesDropdown.classList.remove('show');
      }
    }
  }

  // 修改搜索图标点击事件，确保事件监听器正确绑定
  searchIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDropdown();
  });

  // 确保下拉菜单的点击事件阻止冒泡
  enginesDropdown.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  // 点击文档其他地方关闭菜单
  document.addEventListener('click', () => {
    toggleDropdown(false);
  });

  // Initialize
  updateSearchEngine();
  searchBox.focus();
});
