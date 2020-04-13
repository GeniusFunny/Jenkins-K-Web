import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './sider.css';

import {
  LogoutOutlined,
  SlidersOutlined,
  ClusterOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function SiderLyout(props) {
  const { location } = props;
  const selectedPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  function handleChangeToggle() {
    setCollapsed(!collapsed);
  }
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={handleChangeToggle}>
      <div className={styles.logo}>App</div>
      <Menu theme="dark" defaultSelectedKeys={[selectedPath]} mode="inline">
        <Menu.Item key="/deployments">
          <Link to="/deployments">
            <ClusterOutlined />
            <span>线上实例管理</span>
          </Link>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <SlidersOutlined />
              <span>集成管理</span>
            </span>
          }
        >
          <Menu.Item key="/views">
            <Link to="/views">视图</Link>
          </Menu.Item>
          <Menu.Item key="/jobs">
            <Link to="/jobs">任务</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="/login">
          <Link to="/login">
            <LogoutOutlined />
            <span>退出</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
