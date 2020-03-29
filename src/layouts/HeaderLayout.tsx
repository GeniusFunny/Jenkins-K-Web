import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

export default function HeaderLayout(props) {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {props.children}
    </Header>
  );
}
