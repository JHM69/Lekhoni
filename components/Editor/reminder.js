class Reminder {
  static get toolbox() {
      return {
          title: 'Reminder',
          icon: `<?xml version="1.0" encoding="utf-8"?>
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.9997 20.5815L16.4179 18.0113M4.9997 20.5815L7.58154 18.0113M11.9997 9.58148V12.5815L13.4416 13.9998M6.74234 3.99735C6.36727 3.62228 5.85856 3.41156 5.32812 3.41156C4.79769 3.41156 4.28898 3.62228 3.91391 3.99735C3.53884 4.37242 3.32813 4.88113 3.32812 5.41156C3.32812 5.942 3.53884 6.4507 3.91391 6.82578M20.0858 6.82413C20.4609 6.44905 20.6716 5.94035 20.6716 5.40991C20.6716 4.87948 20.4609 4.37077 20.0858 3.9957C19.7107 3.62063 19.202 3.40991 18.6716 3.40991C18.1411 3.40991 17.6324 3.62063 17.2574 3.9957M18.9997 12.5815C18.9997 16.4475 15.8657 19.5815 11.9997 19.5815C8.1337 19.5815 4.9997 16.4475 4.9997 12.5815C4.9997 8.71549 8.1337 5.58149 11.9997 5.58149C15.8657 5.58149 18.9997 8.71549 18.9997 12.5815Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`, // Add a suitable SVG icon
      };
  }

  constructor({ data, api, config, readOnly }) {
    this.api = api;
    this.readOnly = readOnly; // Add a read-only flag
    this.data = {
        value: data.value || '',
        timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
    };
    this.wrapper = undefined;
  }

  
  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }



  // Helper function to format ISO string to local datetime format
  toLocalDateTime(isoString) {
      return new Date(isoString).toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  }
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('reminder-wrapper');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = this.data.value;
    textInput.placeholder = 'Enter your reminder';
    textInput.classList.add('reminder-input');
    textInput.disabled = this.readOnly; // Disable if read-only
    this.wrapper.appendChild(textInput);

    const timestampInput = document.createElement('input');
    timestampInput.type = 'datetime-local';
    timestampInput.value = this.toLocalDateTime(this.data.timestamp);
    timestampInput.classList.add('reminder-timestamp');
    timestampInput.disabled = this.readOnly; // Disable if read-only
    this.wrapper.appendChild(timestampInput);

    if (!this.readOnly) {
        // Add event listeners only if not read-only
        textInput.addEventListener('input', (e) => {
            this.data.value = e.target.value;
        });
        timestampInput.addEventListener('input', (e) => {
            this.data.timestamp = e.target.value;
        });
    }

    return this.wrapper;
}

  save(blockContent) {
      return {
          value: blockContent.querySelector('input[type="text"]').value,
          timestamp: blockContent.querySelector('input[type="datetime-local"]').value,
      };
  }

  validate(savedData) {
      if (!savedData.value.trim()) {
          return false;
      }
      // Additional check for valid date
      return !isNaN(new Date(savedData.timestamp).getTime());
  }
}

export default Reminder;
