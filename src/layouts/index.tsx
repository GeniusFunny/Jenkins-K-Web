import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'umi';

import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import SiderLayout from './SiderLayout';

const { Content } = Layout;

export default function BasicLayout(props) {
  const { location, history, match } = props;
  const paths = location.pathname.split('/').filter(path => path);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderLayout location={location} />
      <Layout className="site-layout">
        <HeaderLayout />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {paths.map(path => {
              return <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>;
            })}
          </Breadcrumb>
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
