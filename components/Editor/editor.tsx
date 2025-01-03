'use client';

//import CodeTool from '@editorjs/code';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Underline from '@editorjs/underline';

import P from './image.js';
import InlineCode from '@editorjs/inline-code';

import axios from 'axios';
import Editor from './editorjs';
import Un from './aitext.js';
import { useEffect } from 'react';
import Title from 'title-editorjs';
// import Tag from './tag.js';
// import Reminder from '../../components/editor/reminder';
import getFormattedData from '../../lib/format';

import Warning from '@editorjs/warning';
import List from '@editorjs/list';

import Table from '@editorjs/table';
import { ToolConstructable } from '@editorjs/editorjs';

const CustomEditor: React.FC<any> = ({
  data,
  imageArray,
  handleInstance,
  readOnly,
  id,
  onMessageEdit,
}: {
  data: any;
  imageArray: any;
  handleInstance?: any;
  readOnly: boolean;
  id: string;
  onMessageEdit?: (data: any) => void;
  userTags?: any;
}) => {
  const EDITOR_JS_TOOLS = {
    // tag: {
    //   class: Tag,
    //   shortcut: 'CTRL+SHIFT+C',
    // },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    underline: Underline,
    tabble : Table,
    title: Title,
    image: {
      class: P,
      shortcut: 'CMD+SHIFT+I',
      config: {
        uploader: {
          async uploadByFile(file: any) {
            let formData = new FormData();
            formData.append('file', file);
            const { data } = await axios.post('/api/upload', formData);
           
            imageArray.push(data.downloadUrl);
            return {
              success: true,
              file: {
                url: data.downloadUrl,
              },
              categories: data.tags,
            };
          },
        },
      },
    },
   
    // reminder: Reminder,
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H',
    },
    table: Table,
    
    aiText: {
      shortcut: 'CTRL+A',
      class: Un as unknown as ToolConstructable,
      config: {
        openaiKey: process.env.OPENAI_API_KEY,
      }
    },
     
    warning: {
      class: Warning,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+W',
      config: {
        titlePlaceholder: 'Title',
        messagePlaceholder: 'Message',
      },
    },
    
    inlineCode: InlineCode, 
    list: {
      class: List,
      inlineToolbar: true,
    },
  };
  let editor = { isReady: false };

  useEffect(() => {
    if (!editor.isReady) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      editor = new Editor({
        holder: id,
        onReady: () => {
          editor.isReady = true;
        },
        // autofocus: !readOnly,
        readOnly: readOnly,
        defaultBlock: 'paragraph',
        minHeight: 0,
        tools: EDITOR_JS_TOOLS,
        placeholder: 'ekhana lakhan...',
        data: data,
        onChange: async (api: any, event: any) => {
         
          const response = await editor.save();
          const onlyText = getFormattedData(response?.blocks);
          console.log("onlyText : ", response?.blocks);
          if (onMessageEdit) {
            onMessageEdit(onlyText);
          }
        },
      }) as any;

      if (handleInstance) {
        handleInstance(editor);
      }
    }
  }, []);

  return (
    <div
      className={`text-white w-full min-w-[300px] p-2 shadow-xs ${
        id === 'composer' ? ' h-auto ' : ' h-fit '
      } rounded placeholder-[#D9D9D9] `}
      id={id}
    ></div>
  );
};

// Return the CustomEditor to use by other components.
export default CustomEditor;