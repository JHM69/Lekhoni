interface StyleOptions {
  font?: string;
  primaryColor?: string;
  accentColor?: string;
}

export function convertToHTMLText(

  content: string, 
  thumbnail?: string,
  title?: string, 
  caption?: string, 
  options: StyleOptions = {}
): string {
  const {
    font = "'Comic Sans MS', 'Chalkboard SE', 'Arial', sans-serif",
    primaryColor = "#FF6B6B",
    accentColor = "#4ECDC4"
  } = options;

  return `
    <div style="
      max-width: 800px;
      margin: 0 auto;
      padding: 2.5rem;
      font-family: ${font};
      line-height: 1.6;
      color: #2d3748;
      background: #ffffff;
      background-image: 
        radial-gradient(#${primaryColor}11 20%, transparent 20%),
        radial-gradient(#${accentColor}11 20%, transparent 20%);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      border-radius: 15px;
      box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 0 0 8px ${primaryColor}22,
        0 0 0 16px ${accentColor}11;
    ">
      ${thumbnail ? `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        ">
          <img 
            src="${thumbnail}" 
            style="
              width: 100%;
              max-width: 300px;
              height: auto;
              object-fit: cover;
              border-radius: 12px;
              box-shadow: 0 6px 12px rgba(0,0,0,0.15);
              border: 4px solid ${primaryColor};
            "
          />
        </div>
      ` : ''}
      <div style="
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 1.5em;
        color: ${primaryColor};
        text-align: center;
        text-shadow: 2px 2px 0 ${accentColor}44;
        padding: 0.5em;
        background: linear-gradient(45deg, ${primaryColor}11, ${accentColor}22);
        border-radius: 12px;
        border: 2px dashed ${primaryColor}66;
      ">${title}</div>
      <div style="
        font-style: italic;
        margin-bottom: 2.5em;
        color: #4a5568;
        font-size: 20px;
        line-height: 1.8;
        text-align: center;
        padding: 1em;
        background: ${accentColor}11;
        border-radius: 8px;
      ">${caption}</div>
      <div style="
        background: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        border: 3px solid ${primaryColor}44;
        box-shadow: 
          0 4px 6px rgba(0,0,0,0.07),
          0 0 0 6px ${accentColor}22;
        font-size: 18px;
      ">${content}</div>
      <div style="
        text-align: center;
        margin-top: 2rem;
        font-size: 14px;
        color: ${primaryColor}88;
        font-style: italic;
      ">Generated by Lekhoni</div>
    </div>
  `;
}

// Usage example:
// convertToHTMLText(
//   "The Magic Forest",
//   "A tale of wonder and friendship",
//   content,
//   "path/to/thumbnail.jpg",
//   { 
//     font: "Trebuchet MS",
//     primaryColor: "#FF6B6B",
//     accentColor: "#4ECDC4"
//   }
// );

