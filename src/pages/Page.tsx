import React, { useState } from 'react';
import Editor from '~/components/Editor';
import PageView from "~/components/Pagination";

const Page: React.FC = () =>
{
  const [content, setContent] = useState<string>('');

  return (
    <div>
      <Editor content={content} setContent={setContent} />
      <PageView content={content} />
    </div>
  );
};

export default Page;
