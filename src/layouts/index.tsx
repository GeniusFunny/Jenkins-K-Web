import React from 'react';
import { Layout } from 'antd';

import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import SiderLayout from './SiderLayout';

const { Content } = Layout;

export default function BasicLayout(props) {
  const { location } = props;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderLayout location={location} />
      <Layout>
        <HeaderLayout />
        <Content>
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
