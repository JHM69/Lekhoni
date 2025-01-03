const getFormattedData = (blocks: any) => { 
  let markdownContent = '';

  console.log(blocks);

  blocks?.forEach((block: any) => {
      if (block.type === 'tag') {
          markdownContent += `Text Category: [${block.data.text}] : \n\n`;
      } else if (block.type === 'paragraph') {
          markdownContent += `${block.data.text}\n\n`;
      } else if (block.type === 'header') {
          markdownContent += `${'#'.repeat(block.data.level)} ${block.data.text}\n\n`;
      }else if(block.type === 'linkTool'){
            markdownContent += `Link: ${block.data.link}\n\n`;
            markdownContent += `Title: ${block?.data?.meta?.title}\n\n`;
            markdownContent += `Description: ${block?.data?.meta?.description}\n\n`;
            markdownContent += `Image: ${block?.data?.meta?.image?.url}\n\n`;
      } else if (block.type === 'list') {
          markdownContent += block.data.style === 'ordered' ? '1. ' : '- ';
          markdownContent += `${block.data.items.join('\n')}\n\n`;
      }else if (block.type === 'checklist') {
        markdownContent +=   '- ';
        markdownContent += `${block.data.items.map((item: any) =>  item.checked ? `[x] ${item.text}` : `[ ] ${item.text}`).join('\n')}\n\n`;
      } else if (block.type === 'quote') {
          markdownContent += `> ${block.data.text}\n\n`;
      } else if (block.type === 'code') {
          markdownContent += '```\n';
          markdownContent += `${block.data.code}\n`;
          markdownContent += '```\n\n';
      } else if (block.type === 'delimiter') {
          markdownContent += '---\n\n';
      } else if (block.type === 'image') {
          markdownContent += `![${block.data.caption} ImageTags: {${block.data.categories}} ](${block.data.file.url})\n\n`;
      } else if (block.type === 'embed') { 
          markdownContent += `Source: ${block.data.type}\n\n`;
          markdownContent += `Title: ${block?.data?.title}\n\n`
          markdownContent += `Description: ${block?.data?.description}\n\n`;
          markdownContent += `Image: ${block?.data?.image}\n\n`;
      } else if (block.type === 'tabble') {
          markdownContent += '|';
          block.data.content.forEach((row: any) => {
              row.forEach((cell: any) => {
                  markdownContent += ` ${cell} |`;
              });
              markdownContent += '\n';
          });
          markdownContent += '\n';
      } else if (block.type === 'raw') {
          markdownContent += `${block.data.html}\n\n`;
      }else if (block.type === 'Math') {
          markdownContent += `${block.data.math}\n\n`;
      }else if (block.type === 'reminder') {
          markdownContent += `Reminder: ${block.data.value} : ${block.data.timestamp}\n\n`;
      }else {
          // Handle other block types as needed
          if (block?.data?.text) {
              markdownContent += block?.data?.text + '\n';
          }
      }
  });

 

  
  console.log(markdownContent);

  return markdownContent;
};

export default getFormattedData;
