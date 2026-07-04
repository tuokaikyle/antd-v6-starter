import { Suspense, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  BellOutlined,
  LoginOutlined,
  MenuOutlined,
  ProjectOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Outlet, useRouterState, useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ConfigProvider,
  Dropdown,
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

type MenuItem = Required<MenuProps>['items'][number];

type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <AppstoreOutlined /> },
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


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const menuItems = useMemo(() => toMenuItems(navItems), []);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = routerState.location.pathname;

  const keyToPath: Record<string, string> = {
    dashboard: '/',
    'workspace-overview': '/workspace',
    projects: '/workspace/projects',
    tasks: '/workspace/tasks',
    calendar: '/workspace/calendar',
    settings: '/settings',
  };

  const pathToKey: Record<string, string> = {
    '/': 'dashboard',
    '/workspace': 'workspace-overview',
    '/workspace/projects': 'projects',
    '/workspace/tasks': 'tasks',
    '/workspace/calendar': 'calendar',
    '/settings': 'settings',
  };

  const selectedKey = pathToKey[pathname] ?? 'dashboard';

  const toggleNavigation = () => setCollapsed((value) => !value);
  const handleMenuSelect = ({ key }: { key: string }) => {
    const path = keyToPath[key];
    if (path) navigate({ to: path });
    if (isMobile) setCollapsed(true);
  };
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const breadcrumbItems = useMemo(() => {
    if (pathname === '/') return [{ title: 'Dashboard' }];
    return pathname
      .split('/')
      .filter(Boolean)
      .map((s) => ({ title: s.charAt(0).toUpperCase() + s.slice(1) }));
  }, [pathname]);


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
              <Dropdown
                align={{ offset: [0, 8] }}
                menu={{
                  items: [
                    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
                    { key: 'login', label: 'Log in', icon: <LoginOutlined /> },
                  ],
                  style: { minWidth: 160 },
                }}
                trigger={['click']}
              >
                <Avatar className='user-avatar' style={{ cursor: 'pointer' }}>KS</Avatar>
              </Dropdown>
            </Space>
          </Header>

          <Content className='app-content'>
            <Suspense
              fallback={<div className='page-loading'>Loading...</div>}
            >
              <Outlet />
            </Suspense>
          </Content>
      </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
