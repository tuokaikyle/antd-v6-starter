import React, { lazy, Suspense, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  BellOutlined,
  MenuOutlined,
  ProjectOutlined,
  SearchOutlined,
  SettingOutlined,
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
const OverviewPage = lazy(() => import('./OverviewPage'));
const WorkspacePage = lazy(() => import('./WorkspacePage'));
const ProjectsPage = lazy(() => import('./ProjectsPage'));
const TasksPage = lazy(() => import('./TasksPage'));
const CalendarPage = lazy(() => import('./CalendarPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));

type MenuItem = Required<MenuProps>['items'][number];

type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <AppstoreOutlined /> },
  {
    key: 'workspace',
    label: 'Workspace',
    icon: <ProjectOutlined />,
    children: [
      { key: 'workspace-overview', label: 'Overview' },
      { key: 'projects', label: 'Projects' },
      { key: 'tasks', label: 'Tasks' },
      { key: 'calendar', label: 'Calendar' },
    ],
  },
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

function buildBreadcrumb(
  key: string,
  items: NavItem[],
  parents: { title: string }[] = [],
): { title: string }[] {
  for (const item of items) {
    if (item.key === key) {
      return [...parents, { title: item.label }];
    }
    if (item.children) {
      const found = buildBreadcrumb(key, item.children, [
        ...parents,
        { title: item.label },
      ]);
      if (found.length > 0) return found;
    }
  }
  return [];
}

function findParentKey(key: string, items: NavItem[]): string | undefined {
  for (const item of items) {
    if (item.children?.some((child) => child.key === key)) {
      return item.key;
    }
    if (item.children) {
      const found = findParentKey(key, item.children);
      if (found) return found;
    }
  }
}

const pageMap: Record<string, React.LazyExoticComponent<React.FC>> = {
  overview: OverviewPage,
  'workspace-overview': WorkspacePage,
  projects: ProjectsPage,
  tasks: TasksPage,
  calendar: CalendarPage,
  settings: SettingsPage,
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedKey, setSelectedKey] = useState('overview');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const menuItems = useMemo(() => toMenuItems(navItems), []);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const toggleNavigation = () => setCollapsed((value) => !value);
  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedKey(key);
    const parentKey = findParentKey(key, navItems);
    if (parentKey) setOpenKeys([parentKey]);
    if (isMobile) setCollapsed(true);
  };
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const breadcrumbItems = useMemo(
    () => buildBreadcrumb(selectedKey, navItems),
    [selectedKey],
  );

  const PageComponent = pageMap[selectedKey] ?? OverviewPage;

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
          <div className='sidebar-header'>
            {!collapsed && (
              <div className='brand'>
                <div className='brand-mark'>A</div>
                <div className='brand-copy'>
                  <Text strong>Ant Starter</Text>
                  <Text type='secondary'>Template shell</Text>
                </div>
              </div>
            )}
            <Button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className='sidebar-trigger'
              icon={<MenuOutlined />}
              onClick={toggleNavigation}
              type='text'
            />
          </div>
          <Menu
            className='side-menu'
            items={menuItems}
            mode='inline'
            onOpenChange={handleOpenChange}
            onSelect={handleMenuSelect}
            openKeys={collapsed ? [] : openKeys}
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
                className='nav-trigger mobile-nav-trigger'
                icon={<MenuOutlined />}
                onClick={toggleNavigation}
                type='text'
              />
              <Breadcrumb
                className='header-breadcrumb'
                items={breadcrumbItems}
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
              fallback={<div className='page-loading'>Loading...</div>}
            >
              <PageComponent />
            </Suspense>
          </Content>
      </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
