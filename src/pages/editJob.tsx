import React, { useEffect } from 'react';
import { updateJobConfig, fetchJobConfig } from '../services/index';
import { history } from 'umi';
import {
  Form,
  Input,
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
type Props = {
  location: {
    query: {
      job: string;
    };
  };
};
function EditJob(props: Props) {
  const jobName = props.location.query.job || '';
  const [form] = Form.useForm();
  async function setValues() {
    try {
      const res = await fetchJobConfig(jobName);
      const { project = {} } = res;
      form.setFieldsValue({
        name: jobName, // 任务名称
        description: project.description, // 任务描述
        gitUrl:
          project.scm.userRemoteConfigs['hudson.plugins.git.UserRemoteConfig']
            .url, // git地址
        gitCredetialsId:
          project.scm.userRemoteConfigs['hudson.plugins.git.UserRemoteConfig']
            .credetialsId, // git认证码
        command: project.builders['hudson.tasks.Shell'].command, // 构建命令
        webhookToken:
          project.triggers['org.jenkinsci.plugins.gwt.GenericTrigger'].token, // webhook token，设置后需用在git仓库设置webhook
        recipientList:
          project.publishers['hudson.plugins.emailext.ExtendedEmailPublisher']
            .recipientList, // 收件人
      });
    } catch (e) {
      message.error('获取失败');
    }
  }
  useEffect(() => {
    setValues();
  }, [jobName]);
  function handleClick() {
    form.validateFields().then(async data => {
      try {
        await updateJobConfig(data.name, data);
        message.success('更新成功', 2, () => {
          history.push('/jobs');
        });
      } catch (e) {
        message.error('更新失败');
      }
    });
  }
  return (
    <Layout>
      <Form {...formItemLayout} form={form}>
        <Row justify={'center'}>
          <Title level={4}>任务配置</Title>
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
export default EditJob;
