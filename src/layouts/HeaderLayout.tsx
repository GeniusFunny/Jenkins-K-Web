import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

export default function HeaderLayout() {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}></Header>
  );
}
