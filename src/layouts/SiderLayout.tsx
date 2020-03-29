import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';

import {
  LogoutOutlined,
  HomeFilled,
  BarChartOutlined,
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
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={[selectedPath]} mode="inline">
        <Menu.Item key="/">
          <Link to="/">
            <HomeFilled />
            <span>首页</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/live">
          <Link to="/live">
            <BarChartOutlined />
            <span>监控</span>
          </Link>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <SlidersOutlined />
              <span>任务管理</span>
            </span>
          }
        >
          <Menu.Item key="/view">
            <Link to="/view">视图</Link>
          </Menu.Item>
          <Menu.Item key="/job">
            <Link to="/job">任务</Link>
          </Menu.Item>
          <Menu.Item key="/build">
            <Link to="/build">构建</Link>
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
