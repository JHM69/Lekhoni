import { useSettingsStore } from "@/lib/store-settings";

class Tag { 
    static get toolbox() {
      return {
        icon: `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 6L21 6.00048M13 12L21 12.0005M13 18L21 18.0005M6 4V20M6 4L3 7M6 4L9 7M6 20L3 17M6 20L9 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        title: 'Tag',
      };
    }
  
    constructor({ data, config, api, readOnly }) {
      this.data = data || { tag: 'idea' };
      this.api = api;
      this.readOnly = readOnly;

    }

      /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
    static get isReadOnlySupported() {
      return true;
    }


    render() {
      const container = document.createElement('div');
      container.classList.add('tag-tool-container');
  
      // Custom dropdown container
      const dropdownContainer = document.createElement('div');
      dropdownContainer.classList.add('custom-dropdown');
  
      // Displayed value of the dropdown
      const displayedValue = document.createElement('div');
      displayedValue.classList.add('displayed-value');
      dropdownContainer.appendChild(displayedValue);
  
      // Dropdown items container
      const itemsContainer = document.createElement('div');
      itemsContainer.classList.add('dropdown-items');
      dropdownContainer.appendChild(itemsContainer);
  
      // Fetching tags from the settings store
      const tags = useSettingsStore.getState().tags;
  
      // Creating dropdown items
      tags.forEach(tag => {
          const item = document.createElement('div');
          item.classList.add('dropdown-item');
          item.innerHTML = `${tag.icon} ${tag.name}`;
          if (!this.readOnly) {
              item.onclick = () => {
                  displayedValue.innerHTML = item.innerHTML;
                  this.data.text = tag.name;
                  this.data.icon = tag.icon;
                  itemsContainer.style.display = 'none';
              };
          }
          itemsContainer.appendChild(item);
      });
  
      // Setting the initial displayed value
      const foundCategory = tags.find(cat => cat.slug === this.data.text);
      displayedValue.innerHTML = foundCategory ? `${foundCategory.icon} ${foundCategory.name}` : itemsContainer.firstChild.innerHTML;
  
      // Setting the click event for the displayed value
      if (!this.readOnly) {
          displayedValue.onclick = () => {
              itemsContainer.style.display = itemsContainer.style.display === 'block' ? 'none' : 'block';
          };
      }
  
      container.appendChild(dropdownContainer);
  
      return container;
  }
  
    
    save() {
      return {
        text: this.data.text,
        icon : this.data.icon
      };
    }
}

export default Tag;