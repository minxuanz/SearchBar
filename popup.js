
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box");
  const searchIcon = document.getElementById("search-icon");
  const upIcon = document.getElementById("up-icon");
  const downIcon = document.getElementById("down-icon");
  const addEngine = document.getElementById("add-icon");
  const deleteIcon = document.getElementById("delete-icon");

  let engines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'icons/google.png' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'icons/bing.png' },
    { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'icons/baidu.png' },
    { name: 'Duckduckgo', url: 'https://www.duckduckgo.com/?q=', icon: 'icons/duckduckgo.png' },
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

  addEngine.addEventListener('click', () => {
    const customUrl = prompt("Enter the search URL (use {q} for query placeholder):", "https://github.com/search?q=");
    if (customUrl) {
      const customName = prompt("Enter a name for this search engine:", "Custom Engine");
      const customIcon = prompt("Enter the icon URL for this search engine:", "icons/custom.png");

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

  deleteIcon.addEventListener('click', () => {
    // Check if the current engine is a custom engine
    if (currentEngineIndex >= engines.length - customEngines.length) {
      const confirmed = confirm("Are you sure you want to delete this custom search engine?");
      if (confirmed) {
        // Remove from engines and customEngines
        const customIndex = currentEngineIndex - (engines.length - customEngines.length);
        customEngines.splice(customIndex, 1);
        engines.splice(currentEngineIndex, 1);

        // Save updated custom engines to localStorage
        localStorage.setItem('customEngines', JSON.stringify(customEngines));

        // Update currentEngineIndex
        currentEngineIndex = Math.min(currentEngineIndex, engines.length - 1);
        updateSearchEngine();
      }
    } else {
      alert("Default search engines cannot be deleted.");
    }
  });

  // Initialize
  updateSearchEngine();
  searchBox.focus();
});
