const fs = require('fs');
const files = [
  'src/components/ui/CommandPalette.tsx',
  'src/components/ui/VirtualTable.tsx',
  'src/features/calendar/components/Calendar.tsx',
  'src/features/copiloto-ia/components/ConversationsTab.tsx',
  'src/features/crm360/components/PropostasList.tsx',
  'src/features/crm/components/KanbanCard.tsx',
  'src/features/intelligence/components/AutomationGuide.tsx',
  'src/features/intelligence/components/RobustScriptGenerator.tsx',
  'src/features/market-intelligence/components/VisualOrgChart.tsx',
  'src/features/prospecting/components/prospecting-hub/OcrCapturePanel.tsx',
  'src/features/voice-hub/components/studio/panels/LayersPanel.tsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Match <button ... type="button" ... type="button" ... >
  c = c.replace(/<button([^>]*)>/g, (m, attrs) => {
     let newAttrs = attrs.replace(/\btype=(["'])button\1/g, '@@TYPE_BTN@@');
     let parts = newAttrs.split('@@TYPE_BTN@@');
     if (parts.length > 2) {
        newAttrs = parts[0] + ' type="button"' + parts.slice(1).join('');
        return '<button' + newAttrs + '>';
     }
     return m;
  });
  fs.writeFileSync(f, c);
  console.log('Fixed dupes in ' + f);
});
