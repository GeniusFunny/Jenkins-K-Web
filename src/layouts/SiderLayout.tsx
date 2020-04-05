import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './sider.css';

import {
  LogoutOutlined,
  BarChartOutlined,
  SlidersOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
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
      <div className={styles.logo}>Jenkins-K</div>
      <Menu theme="dark" defaultSelectedKeys={[selectedPath]} mode="inline">
        <Menu.Item key="/">
          <Link to="/">
            <BarChartOutlined />
            <span>监控</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/deploy">
          <Link to="/deploy">
            <DeploymentUnitOutlined />
            <span>发布</span>
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
        <SubMenu
          key="sub2"
          title={
            <span>
              <ClusterOutlined />
              <span>线上实例管理</span>
            </span>
          }
        >
          <Menu.Item key="/rollback">回滚</Menu.Item>
          <Menu.Item key="/close">关闭</Menu.Item>
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
