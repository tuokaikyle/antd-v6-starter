import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  return (
    <>
      <Title level={2}>Settings</Title>
      <Paragraph>Configure your application settings.</Paragraph>
    </>
  );
}
