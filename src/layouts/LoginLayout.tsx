import React, { useState } from 'react';
import { Layout } from 'antd';

import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';

const { Content } = Layout;

export default function BasicLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  function handleChangeToggle() {
    setCollapsed(!collapsed);
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <HeaderLayout />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {props.children}
          </div>
        </Content>
        <FooterLayout />
      </Layout>
    </Layout>
  );
}
