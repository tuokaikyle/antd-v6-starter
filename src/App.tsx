import React, { lazy, Suspense, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  MenuOutlined,
  ProjectOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ConfigProvider,
  Flex,
  Input,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from 'antd';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const DashboardPage = lazy(() => import('./DashboardPage'));

type MenuItem = Required<MenuProps>['items'][number];

type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <AppstoreOutlined /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
  {
    key: 'workspace',
    label: 'Workspace',
    icon: <ProjectOutlined />,
    children: [
      { key: 'projects', label: 'Projects' },
      { key: 'tasks', label: 'Tasks' },
      { key: 'calendar', label: 'Calendar', icon: <CalendarOutlined /> },
    ],
  },
  { key: 'team', label: 'Team', icon: <TeamOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
];

function toMenuItems(items: NavItem[]): MenuItem[] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children ? toMenuItems(item.children) : undefined,
  }));
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const selectedKey = 'overview';
  const menuItems = useMemo(() => toMenuItems(navItems), []);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const toggleNavigation = () => setCollapsed((value) => !value);
  const closeMobileNavigation = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
          colorPrimary: '#2563eb',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <Layout className='app-shell' style={{ background: colorBgLayout }}>
        <Sider
          breakpoint='lg'
          className='app-sider'
          collapsed={collapsed}
          collapsedWidth={isMobile ? 0 : 72}
          onBreakpoint={(broken) => {
            setIsMobile(broken);
            setCollapsed(broken);
          }}
          theme='light'
          trigger={null}
          width={256}
        >
          <Flex align='center' className='brand' gap={12}>
            <div className='brand-mark'>A</div>
            {!collapsed && (
              <div className='brand-copy'>
                <Text strong>Ant Starter</Text>
                <Text type='secondary'>Template shell</Text>
              </div>
            )}
          </Flex>
          <Menu
            className='side-menu'
            items={menuItems}
            mode='inline'
            onClick={closeMobileNavigation}
            openKeys={collapsed ? [] : ['workspace']}
            selectedKeys={[selectedKey]}
            theme='light'
          />
        </Sider>

        {isMobile && !collapsed && (
          <button
            aria-label='Close navigation'
            className='mobile-backdrop'
            onClick={() => setCollapsed(true)}
            type='button'
          />
        )}

        <Layout className='app-main'>
          <Header className='app-header'>
            <Flex align='center' className='header-left' gap={8}>
              <Button
                aria-label={collapsed ? 'Open navigation' : 'Close navigation'}
                className='nav-trigger'
                icon={<MenuOutlined />}
                onClick={toggleNavigation}
                type='text'
              />
              <Breadcrumb
                className='header-breadcrumb'
                items={[{ title: 'Workspace' }, { title: 'Overview' }]}
              />
            </Flex>

            <Space className='header-actions' size={12}>
              <Input
                allowClear
                className='header-search'
                placeholder='Search'
                prefix={<SearchOutlined />}
              />
              <Badge dot offset={[-4, 4]}>
                <Button
                  aria-label='Notifications'
                  icon={<BellOutlined />}
                  shape='circle'
                  type='text'
                />
              </Badge>
              <Avatar className='user-avatar'>KS</Avatar>
            </Space>
          </Header>

          <Content className='app-content'>
            <Suspense
              fallback={<div className='page-loading'>Loading overview...</div>}
            >
              <DashboardPage />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
