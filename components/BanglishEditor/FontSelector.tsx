interface FontSelectorProps {
  onChange: (value: string) => void;
  currentFont: string;
}

const FontSelector = ({ onChange, currentFont }: FontSelectorProps) => (
  <select
    onChange={(e) => onChange(e.target.value)}
    value={currentFont}
    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Font Selector"
  >
    <option value="Kalpurush">Kalpurush</option>
    <option value="SolaimanLipi">SolaimanLipi</option>
    <option value="NikoshBAN">Nikosh BAN</option>
  </select>
);


export default FontSelector