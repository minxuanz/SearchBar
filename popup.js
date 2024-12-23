document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box");
  const searchIcon = document.getElementById("search-icon");
  const upIcon = document.getElementById("up-icon");
  const downIcon = document.getElementById("down-icon");

  const engines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'icons/google.png', alt: 'G' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'icons/bing.png', alt: 'B' },
    { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', icon: 'icons/baidu.png', alt: 'BA' },
    { name: 'Duckduckgo', url: 'https://www.duckduckgo.com/?q=', icon: 'icons/duckduckgo.png', alt: 'D' },
  ];

  // Load current engine index from localStorage or default to 0
  let currentEngineIndex = localStorage.getItem('currentEngineIndex');
  if (currentEngineIndex === null) {
    currentEngineIndex = 0;
  } else {
    currentEngineIndex = parseInt(currentEngineIndex, 10);
  }

  function updateSearchEngine() {
    const engine = engines[currentEngineIndex];
    searchIcon.src = engine.icon;
    searchIcon.alt = engine.alt;
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

  // Initialize
  updateSearchEngine();
  searchBox.focus();
});
