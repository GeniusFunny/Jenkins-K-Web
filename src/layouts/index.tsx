import React from 'react';
import { Layout } from 'antd';

import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import SiderLayout from './SiderLayout';

const { Content } = Layout;

export default function BasicLayout(props) {
  const { location, history, match } = props;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderLayout location={location} />
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
