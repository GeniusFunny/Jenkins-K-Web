import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export default function FooterLayout(props) {
  return <Footer style={{ textAlign: 'center' }}>{props.children}</Footer>;
}
