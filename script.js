// ===================================
// Daily Bible Readings - Main Script
// ===================================

// 1. DYNAMIC DATE AND LITURGICAL CALENDAR
class LiturgicalDate {
  constructor() {
    this.today = new Date();
  }

  getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return this.today.toLocaleDateString('en-US', options).toUpperCase();
  }

  updateDateDisplay() {
    const dateElement = document.querySelector('h1 b');
    if (dateElement) {
      const currentDate = this.getFormattedDate();
      dateElement.textContent = currentDate + '. FIFTH WEEK IN ORDINARY TIME YEAR B';
    }
  }
}

// 2. TEXT SEARCH AND HIGHLIGHTING
class BibleSearcher {
  constructor() {
    this.searchInput = this.createSearchElement();
    this.highlightedText = null;
  }

  createSearchElement() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input 
        type="text" 
        id="searchBox" 
        placeholder="Search in readings..." 
        class="search-input"
      >
      <button id="clearSearch" class="search-btn">Clear</button>
    `;
    return searchContainer;
  }

  insertSearch() {
    const body = document.body;
    body.insertBefore(this.searchInput, body.querySelector('h2'));
  }

  search(query) {
    if (!query) {
      this.clearHighlight();
      return;
    }

    const preElements = document.querySelectorAll('pre');
    const regex = new RegExp(`(${query})`, 'gi');

    preElements.forEach(pre => {
      pre.innerHTML = pre.innerHTML.replace(
        regex,
        '<mark class="highlight">$1</mark>'
      );
    });
  }

  clearHighlight() {
    document.querySelectorAll('mark.highlight').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  init() {
    this.insertSearch();
    const searchBox = document.getElementById('searchBox');
    const clearBtn = document.getElementById('clearSearch');

    searchBox.addEventListener('input', (e) => {
      this.search(e.target.value);
    });

    clearBtn.addEventListener('click', () => {
      searchBox.value = '';
      this.clearHighlight();
    });
  }
}

// 3. COPY TO CLIPBOARD FUNCTIONALITY
class TextCopier {
  static copySection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const text = section.innerText;
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('✓ Copied to clipboard!');
    });
  }

  static showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  static addCopyButtons() {
    const sections = document.querySelectorAll('pre');
    sections.forEach((section, index) => {
      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.innerHTML = '📋 Copy';
      button.addEventListener('click', () => {
        TextCopier.copySection(section.id || index);
      });
      section.parentElement.insertBefore(button, section);
    });
  }
}

// 4. TABLE OF CONTENTS / NAVIGATION
class TableOfContents {
  constructor() {
    this.headings = [];
    this.tocContainer = this.createTOC();
  }

  createTOC() {
    const container = document.createElement('nav');
    container.className = 'toc-container';
    container.innerHTML = '<h3>📚 Quick Navigation</h3><ul id="tocList"></ul>';
    return container;
  }

  buildTOC() {
    const h2Elements = document.querySelectorAll('h2');
    const tocList = this.tocContainer.querySelector('#tocList');

    h2Elements.forEach((heading, index) => {
      heading.id = `section-${index}`;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#section-${index}`;
      a.textContent = heading.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  init() {
    document.body.insertBefore(this.tocContainer, document.querySelector('h2'));
    this.buildTOC();
  }
}

// 5. DARK MODE TOGGLE
class DarkModeToggle {
  constructor() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.toggle = this.createToggle();
  }

  createToggle() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.innerHTML = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    button.addEventListener('click', () => this.toggleMode());
    return button;
  }

  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode);
    document.body.classList.toggle('dark-mode');
    this.toggle.innerHTML = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  init() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
    document.body.appendChild(this.toggle);
  }
}

// 6. READING TIME CALCULATOR
class ReadingTime {
  static calculateTime(text) {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Average 200 words per minute
    return minutes;
  }

  static addReadingTime() {
    const preElements = document.querySelectorAll('pre');
    preElements.forEach(pre => {
      const text = pre.innerText;
      const time = this.calculateTime(text);
      const badge = document.createElement('span');
      badge.className = 'reading-time';
      badge.innerHTML = `⏱️ ${time} min read`;
      pre.parentElement.insertBefore(badge, pre);
    });
  }
}

// 7. SMOOTH SCROLLING
class SmoothScroll {
  static init() {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
}

// 8. KEYBOARD SHORTCUTS
class KeyboardShortcuts {
  static init() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBox')?.focus();
      }
      // Ctrl/Cmd + D for dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.querySelector('.dark-mode-toggle')?.click();
      }
    });
  }
}

// 9. PRINT FUNCTIONALITY
class PrintManager {
  static addPrintButton() {
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = '🖨️ Print';
    printBtn.addEventListener('click', () => {
      window.print();
    });
    document.body.appendChild(printBtn);
  }
}

// 10. ACCESSIBILITY ENHANCEMENTS
class A11y {
  static init() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark
    const main = document.createElement('main');
    main.id = 'main';
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
  }
}

// 11. ANALYTICS & ENGAGEMENT
class EngagementTracker {
  static init() {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        console.log(`Reading depth: ${Math.round(maxScroll)}%`);
      }
    });

    // Track reading time
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const readingTime = Math.round((Date.now() - startTime) / 1000 / 60);
      console.log(`Total reading time: ${readingTime} minutes`);
    });
  }
}

// 12. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  const liturgicalDate = new LiturgicalDate();
  liturgicalDate.updateDateDisplay();

  const searcher = new BibleSearcher();
  searcher.init();

  const toc = new TableOfContents();
  toc.init();

  const darkMode = new DarkModeToggle();
  darkMode.init();

  TextCopier.addCopyButtons();
  ReadingTime.addReadingTime();
  SmoothScroll.init();
  KeyboardShortcuts.init();
  PrintManager.addPrintButton();
  A11y.init();
  EngagementTracker.init();

  console.log('✅ Daily Readings loaded successfully!');
});