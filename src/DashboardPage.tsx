import type { TableProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

const { Text, Title } = Typography;

type WorkItem = {
  key: string;
  name: string;
  owner: string;
  status: 'Healthy' | 'At risk' | 'Review';
  due: string;
};

const activity = [
  {
    title: 'Design system',
    detail: 'Package promoted to beta',
    time: '12 min ago',
    tone: 'blue',
  },
  {
    title: 'Planning',
    detail: 'Quarterly workspace archived',
    time: '1 hr ago',
    tone: 'teal',
  },
  {
    title: 'Operations',
    detail: 'New member invited',
    time: '3 hrs ago',
    tone: 'green',
  },
  {
    title: 'Billing',
    detail: 'Workflow passed review',
    time: 'Yesterday',
    tone: 'orange',
  },
];

const workItems: WorkItem[] = [
  {
    key: '1',
    name: 'Admin shell polish',
    owner: 'Design',
    status: 'Healthy',
    due: 'Today',
  },
  {
    key: '2',
    name: 'Usage dashboard',
    owner: 'Product',
    status: 'Review',
    due: 'Tomorrow',
  },
  {
    key: '3',
    name: 'Access audit',
    owner: 'Platform',
    status: 'At risk',
    due: 'Friday',
  },
  {
    key: '4',
    name: 'Template docs',
    owner: 'Engineering',
    status: 'Healthy',
    due: 'Next week',
  },
];

const statusColor: Record<WorkItem['status'], string> = {
  Healthy: 'success',
  'At risk': 'warning',
  Review: 'processing',
};

const columns: TableProps<WorkItem>['columns'] = [
  {
    title: 'Workstream',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => <Text strong>{name}</Text>,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    responsive: ['md'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: WorkItem['status']) => (
      <Tag color={statusColor[status]}>{status}</Tag>
    ),
  },
  {
    title: 'Due',
    dataIndex: 'due',
    key: 'due',
    align: 'right',
  },
];

export default function DashboardPage() {
  return (
    <>
      <section className='page-heading'>
        <div>
          <Title level={2}>Operational Overview</Title>
          <Text type='secondary'>
            A clean, route-ready Ant Design template for internal tools.
          </Text>
        </div>
        <Space>
          <Button>Export</Button>
          <Button type='primary'>New Project</Button>
        </Space>
      </section>

      <Row className='content-grid' gutter={[16, 16]}>
        <Col xl={16} xs={24}>
          <Card
            className='panel-card'
            extra={<Button type='link'>View all</Button>}
            title='Priority Work'
          >
            <Table
              columns={columns}
              dataSource={workItems}
              pagination={false}
              rowKey='key'
              size='middle'
            />
          </Card>
        </Col>
        <Col xl={8} xs={24}>
          <Card className='panel-card activity-card' title='Recent Activity'>
            <ul className='activity-list'>
              {activity.map((item) => (
                <li key={`${item.title}-${item.time}`}>
                  <span aria-hidden='true' className={`activity-dot activity-${item.tone}`} />
                  <div>
                    <Flex align='center' justify='space-between'>
                      <Text strong>{item.title}</Text>
                      <Text type='secondary'>{item.time}</Text>
                    </Flex>
                    <Text type='secondary'>{item.detail}</Text>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );
}
