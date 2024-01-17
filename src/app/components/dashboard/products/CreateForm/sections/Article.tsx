import React from 'react';

interface Props {
  children: React.ReactNode;
  title: string;
}

export const Article = ({ children, title }: Props) => {
  return (
    <article className='card'>
      <header className='card-header'>
        <h1>{title}</h1>
      </header>
      <div className='card-content'>{children}</div>
    </article>
  );
};
