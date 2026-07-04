import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import App from './App';
import DashboardPage from './DashboardPage';
import WorkspacePage from './WorkspacePage';
import ProjectsPage from './ProjectsPage';
import TasksPage from './TasksPage';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const workspaceLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: 'workspace',
  component: () => <Outlet />,
});

const workspaceIndex = createRoute({
  getParentRoute: () => workspaceLayout,
  path: '/',
  component: WorkspacePage,
});

const projectsRoute = createRoute({
  getParentRoute: () => workspaceLayout,
  path: 'projects',
  component: ProjectsPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => workspaceLayout,
  path: 'tasks',
  component: TasksPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => workspaceLayout,
  path: 'calendar',
  component: CalendarPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workspaceLayout.addChildren([workspaceIndex, projectsRoute, tasksRoute, calendarRoute]),
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
