import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function OverviewPage() {
  return (
    <>
      <Title level={2}>Overview</Title>
      <Paragraph>Welcome to the overview dashboard.</Paragraph>
    </>
  );
}
