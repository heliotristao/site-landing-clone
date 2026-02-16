/**
 * BRIX Templates - Simple Add to Calendar Button for Webflow
 * A free alternative to paid calendar button solutions
 * @version 1.0.0
 */

// Optional: load your external CSS in the main DOM if you wish (won’t affect Shadow DOM)
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = 'https://apps.brixtemplates.com/webflow-calendar-button/styles.css';
document.head.appendChild(cssLink);

/**
 * Full CSS with custom properties for every styling detail.
 * 
 * We explicitly apply `font-family: var(--brix-btn-font-family)` 
 * to `.brix-calendar-btn` so user agent button styles don’t override it.
 */
const shadowCSS = `
/**
 * BRIX Templates - Simple Add to Calendar Button for Webflow
 * Easy to customize styles for the Add to Calendar button
 * @version 1.0.0
 */

/**
 * :host sets default custom property values, 
 * which users can override by styling <brix-calendar-button>.
 */
:host {
  /* Button font properties */
  --brix-btn-font-family: Arial, sans-serif;
  --brix-btn-font-size: 16px;
  --brix-btn-font-weight: 500;

  /* Button visuals */
  --brix-btn-bg: #FFFFFF;
  --brix-btn-color: #454040;
  --brix-btn-border: #E0DBDB;
  --brix-btn-border-radius: 500px;
  --brix-btn-box-shadow: 0px 2px 12px rgba(20, 19, 42, 0.08);

  /* Button spacing & hover */
  --brix-btn-gap: 8px;
  --brix-btn-padding: 10px 16px;
  --brix-btn-hover-bg: #F4F4F4;

  /* Dropdown visuals */
  --brix-dropdown-bg: #FFFFFF;
  --brix-dropdown-border: #F4F4F4;
  --brix-dropdown-border-radius: 12px;
  --brix-dropdown-box-shadow: 0px 2px 12px rgba(20, 19, 42, 0.08);
  --brix-dropdown-width: 230px;
  --brix-dropdown-padding: 8px 0;

  /* Dropdown text font properties */
  --brix-dropdown-font-family: var(--brix-btn-font-family);
  --brix-dropdown-font-size: var(--brix-btn-font-size);
  --brix-dropdown-font-weight: var(--brix-btn-font-weight);
  --brix-dropdown-text-color: #454040;

  /* Dropdown option spacing & hover */
  --brix-option-gap: 8px;
  --brix-option-padding: 8px 16px;
  --brix-option-hover-bg: #F3F3F3;

  /* Icon URLs (no quotes to avoid broken <img> src) */
  --brix-icon-main: https://apps.brixtemplates.com/webflow-calendar-button/calendar-icon.svg;
  --brix-icon-google: https://apps.brixtemplates.com/webflow-calendar-button/google-calendar.svg;
  --brix-icon-outlook: https://apps.brixtemplates.com/webflow-calendar-button/outlook.svg;
  --brix-icon-apple: https://apps.brixtemplates.com/webflow-calendar-button/apple-calendar.png;
}

/* Main Container for Button and Dropdown */
.brix-calendar-button {
    display: inline-block; /* So container fits content width */
    font-family: var(--brix-btn-font-family);
}

/* Main Button Styling */
.brix-calendar-btn {
    display: flex;
    align-items: center;
    gap: var(--brix-btn-gap);
    padding: var(--brix-btn-padding);
    width: max-content;

    /* Visual Styling */
    background-color: var(--brix-btn-bg);
    border: 1px solid var(--brix-btn-border);
    border-radius: var(--brix-btn-border-radius);
    box-shadow: var(--brix-btn-box-shadow);

    /* Text Styling */
    font-family: var(--brix-btn-font-family);
    font-size: var(--brix-btn-font-size);
    font-weight: var(--brix-btn-font-weight);
    color: var(--brix-btn-color);

    /* Interaction */
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
}

/* Button Hover State */
.brix-calendar-btn:hover {
    background-color: var(--brix-btn-hover-bg);
}

/* Button Icon Styling */
.brix-calendar-btn img {
    width: 24px;
    height: 24px;
}

/* Dropdown Menu Container */
.brix-calendar-options {
    position: absolute;
    margin-top: 8px;
    width: var(--brix-dropdown-width);
    padding: var(--brix-dropdown-padding);

    background-color: var(--brix-dropdown-bg);
    border: 1px solid var(--brix-dropdown-border);
    border-radius: var(--brix-dropdown-border-radius);
    box-shadow: var(--brix-dropdown-box-shadow);

    display: none;
    z-index: 999;

    overflow: hidden;
}

/* Dropdown Visibility Toggle Class */
.brix-calendar-options.brix-calendar-options-visible {
    display: block;
}

/* Individual Dropdown Option Styling */
.brix-calendar-option {
    display: flex;
    align-items: center;
    gap: var(--brix-option-gap);
    width: 100%;
    padding: var(--brix-option-padding);

    /* Dropdown text styling */
    font-family: var(--brix-dropdown-font-family);
    font-size: var(--brix-dropdown-font-size);
    font-weight: var(--brix-dropdown-font-weight);
    color: var(--brix-dropdown-text-color);

    text-decoration: none;
    transition: background-color 0.2s;
    cursor: pointer;
}

/* Option Hover State */
.brix-calendar-option:hover {
    background-color: var(--brix-option-hover-bg);
}

/* Option Icon Styling */
.brix-calendar-option img {
    width: 24px;
    height: 24px;
}
`;

class BrixCalendarButton extends HTMLElement {
  constructor() {
    super();
    console.log("[BrixCalendarButton] Constructor called.");
    this.attachShadow({ mode: 'open' });

    // We'll store a bound method so we can remove it in disconnectedCallback
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  static get observedAttributes() {
    return [
      'name', 
      'description', 
      'location', 
      'start-date', 
      'start-time',
      'end-date', 
      'end-time', 
      'time-zone'
    ];
  }

  connectedCallback() {
    console.log("[BrixCalendarButton] connectedCallback triggered.");

    // Inject <style> with default (or overridden) variables
    const styleEl = document.createElement('style');
    styleEl.textContent = shadowCSS;
    this.shadowRoot.appendChild(styleEl);

    // Render the HTML structure
    this.render();

    // Set up event listeners
    this.setupEventListeners();

    // Listen for outside clicks on the document
    document.addEventListener('click', this._onOutsideClick);
  }

  disconnectedCallback() {
    console.log("[BrixCalendarButton] disconnectedCallback triggered.");

    // Clean up the document-level listener to avoid memory leaks
    document.removeEventListener('click', this._onOutsideClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`[BrixCalendarButton] attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);
  }

  // Helper: read a CSS var from the host’s computed style, fallback if needed, strip quotes if present
  getCSSVar(name, fallback = "") {
    const rawVal = getComputedStyle(this).getPropertyValue(name).trim();
    const val = rawVal || fallback;
    return val.replace(/^["']+|["']+$/g, ""); // remove leading/trailing quotes
  }

  get eventData() {
    const startDateTime = `${this.getAttribute('start-date')}T${this.getAttribute('start-time')}`;
    const endDateTime = `${this.getAttribute('end-date')}T${this.getAttribute('end-time')}`;

    console.log("[BrixCalendarButton] eventData:", {
      title: this.getAttribute('name'),
      description: this.getAttribute('description'),
      location: this.getAttribute('location'),
      startDateTime,
      endDateTime
    });

    return {
      title: this.getAttribute('name'),
      description: this.getAttribute('description'),
      location: this.getAttribute('location'),
      startDate: new Date(startDateTime),
      endDate: new Date(endDateTime),
      timeZone: this.getAttribute('time-zone')
    };
  }

  formatDate(date, format = "google") {
    console.log("[BrixCalendarButton] formatDate called with:", date, format);
    const iso = date.toISOString();
    switch (format) {
      case "google":
        return iso.replace(/-|:|\.\d{3}/g, "");
      case "outlook":
        return iso.split(".")[0] + "Z";
      case "ics":
        return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
      default:
        return iso;
    }
  }

  handleGoogleCalendar() {
    console.log("[BrixCalendarButton] handleGoogleCalendar called.");
    const eData = this.eventData;
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + `&text=${encodeURIComponent(eData.title)}`
      + `&dates=${this.formatDate(eData.startDate, "google")}/${this.formatDate(eData.endDate, "google")}`
      + `&details=${encodeURIComponent(eData.description)}`
      + `&location=${encodeURIComponent(eData.location)}`;
    window.open(url, "_blank");
  }

  handleOutlookCalendar() {
    console.log("[BrixCalendarButton] handleOutlookCalendar called.");
    const eData = this.eventData;
    const url = "https://outlook.office.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent"
      + `&subject=${encodeURIComponent(eData.title)}`
      + `&startdt=${this.formatDate(eData.startDate, "outlook")}`
      + `&enddt=${this.formatDate(eData.endDate, "outlook")}`
      + `&body=${encodeURIComponent(eData.description)}`
      + `&location=${encodeURIComponent(eData.location)}`;
    window.open(url, "_blank");
  }

  handleAppleCalendar() {
    console.log("[BrixCalendarButton] handleAppleCalendar called.");
    const eData = this.eventData;
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eData.title}
DESCRIPTION:${eData.description}
LOCATION:${eData.location}
DTSTART:${this.formatDate(eData.startDate, "ics")}
DTEND:${this.formatDate(eData.endDate, "ics")}
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  render() {
    console.log("[BrixCalendarButton] render() called. Constructing HTML with icon URLs.");

    // Gather icon URLs from custom props
    const iconMain   = this.getCSSVar('--brix-icon-main',   'https://apps.brixtemplates.com/webflow-calendar-button/calendar-icon.svg');
    const iconGoogle = this.getCSSVar('--brix-icon-google', 'https://apps.brixtemplates.com/webflow-calendar-button/google-calendar.svg');
    const iconOutlook= this.getCSSVar('--brix-icon-outlook','https://apps.brixtemplates.com/webflow-calendar-button/outlook.svg');
    const iconApple  = this.getCSSVar('--brix-icon-apple',  'https://apps.brixtemplates.com/webflow-calendar-button/apple-calendar.png');

    // We replace the shadowRoot's contents with the HTML markup
    this.shadowRoot.innerHTML += `
      <!-- 
        BRIX Templates - Simple Add to Calendar Button for Webflow
        Refactored with custom props & best practices
        @version 1.0.0
      -->
      <div class="brix-calendar-button">
        <button class="brix-calendar-btn">
          <img src="${iconMain}" alt="Calendar Icon"/>
          <span>Add to Calendar</span>
        </button>
        <div class="brix-calendar-options">
          <a href="#" class="brix-calendar-option" data-calendar="google">
            <img src="${iconGoogle}" alt="Google Calendar Icon"/>
            <span>Google Calendar</span>
          </a>
          <a href="#" class="brix-calendar-option" data-calendar="outlook">
            <img src="${iconOutlook}" alt="Outlook Icon"/>
            <span>Outlook Calendar</span>
          </a>
          <a href="#" class="brix-calendar-option" data-calendar="apple">
            <img src="${iconApple}" alt="Apple Calendar Icon"/>
            <span>Apple Calendar</span>
          </a>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    console.log("[BrixCalendarButton] setupEventListeners() called.");
    const button = this.shadowRoot.querySelector('.brix-calendar-btn');
    const dropdown = this.shadowRoot.querySelector('.brix-calendar-options');
    const options = this.shadowRoot.querySelectorAll('.brix-calendar-option');

    // Click on button => toggle the dropdown
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log("[BrixCalendarButton] Main button clicked. Toggling dropdown.");
      dropdown.classList.toggle('brix-calendar-options-visible');
    });

    // Handle user clicks on each calendar option
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const calendar = e.currentTarget.dataset.calendar;
        console.log("[BrixCalendarButton] Dropdown option clicked:", calendar);

        switch (calendar) {
          case 'google':  this.handleGoogleCalendar(); break;
          case 'outlook': this.handleOutlookCalendar(); break;
          case 'apple':   this.handleAppleCalendar();   break;
        }
        // Hide the dropdown after selection
        dropdown.classList.remove('brix-calendar-options-visible');
      });
    });
  }

  // Document-level click handler to detect outside clicks
  _onOutsideClick(e) {
    const dropdown = this.shadowRoot.querySelector('.brix-calendar-options');
    if (!this.shadowRoot.contains(e.target)) {
      console.log("[BrixCalendarButton] Outside click detected. Closing dropdown.");
      dropdown?.classList.remove('brix-calendar-options-visible');
    }
  }
}

customElements.define('brix-calendar-button', BrixCalendarButton);