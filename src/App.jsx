import React from 'react';
import Glossary from './Glossary';
import Layout from './Layout';

export default function App() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-4 text-center">📘 EN ⇄ DE Glossary</h1> */}
      {/* <Glossary /> */}
      <Layout>
        <Glossary />
      </Layout>

    </div>
  );
}
