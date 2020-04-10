import React from 'react';
import { createJob } from '../services/index';
import { history } from 'umi';
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Layout,
  Row,
  Col,
} from 'antd';

const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
};
function NewJob() {
  const data = {
    name: '', // 任务名称
    description: '', // 任务描述
    gitUrl: '', // git地址
    gitCredetialsId: '', // git认证码
    command: '', // 构建命令
    webhookToken: '', // webhook token，设置后需用在git仓库设置webhook
    recipientList: '', // 收件人
  };
  function handleValuesChange(changedValues = {}) {
    const key = Object.keys(changedValues)[0];
    const value = Object.values(changedValues)[0];
    data[key] = value;
  }
  async function submitData() {
    try {
      await createJob(data);
      message.success('创建成功', 2, () => {
        history.push('/jobs');
      });
    } catch (e) {
      message.error('创建失败');
    }
  }
  const handleClick = () => {
    submitData();
  };
  return (
    <Layout>
      <Form {...formItemLayout} onValuesChange={handleValuesChange}>
        <Row justify={'center'}>
          <Title level={4}>新建任务</Title>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: '请输入任务描述' }]}
            >
              <Input.TextArea placeholder="请输入任务描述" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="gitUrl"
              label="Git地址"
              rules={[{ required: true, message: '请输入Git地址' }]}
            >
              <Input placeholder="请输入Git地址" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gitCredetialsId"
              label="Git Credetials Id"
              rules={[{ required: true, message: '请输入CredetialsId' }]}
            >
              <Input placeholder="请输入CredetialsId" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="webhookToken"
              label="Webhook Token"
              rules={[{ required: true, message: '请输入Token' }]}
            >
              <Input placeholder="请输入Token" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="recipientList"
              label="邮箱地址"
              rules={[
                {
                  required: true,
                  message: `请输入接收通知邮箱地址, 用,分隔多个地址`,
                },
              ]}
            >
              <Input placeholder="请输入接收通知邮箱地址, 用,分隔多个地址" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="command"
              label="构建命令"
              rules={[{ required: true, message: '请输入构建命令' }]}
            >
              <Input.TextArea placeholder="请输入构建命令" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Button
            type="primary"
            style={{ marginTop: 16 }}
            htmlType="submit"
            onClick={handleClick}
          >
            Submit
          </Button>
        </Row>
      </Form>
    </Layout>
  );
}
export default NewJob;
