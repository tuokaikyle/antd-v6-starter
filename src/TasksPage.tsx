import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function TasksPage() {
  return (
    <>
      <Title level={2}>Tasks</Title>
      <Paragraph>Track your tasks here.</Paragraph>
    </>
  );
}
