import React from 'react';
import {
  createDeployment,
  createService,
  deleteDeployment,
} from '../services/index';
import { history } from 'umi';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Typography,
  message,
  Layout,
  Row,
  Col,
} from 'antd';

const { Option } = Select;
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

function NewDeployment() {
  const [form] = Form.useForm();
  form.setFieldsValue({
    namespace: 'default',
    deployment: {
      metadata: {
        name: '',
        labels: '',
      },
      spec: {
        replicas: 0,
        selector: {
          matchLabels: '',
        },
        template: {
          metadata: {
            labels: '',
          },
          spec: {
            containers: '',
          },
        },
      },
    },
    service: {
      metadata: {
        name: '',
        labels: '',
      },
      spec: {
        selector: '',
        type: '',
      },
      ports: '',
    },
  });
  function checkAndWrapperData(data: any) {
    const { deployment, service } = data;
    try {
      const deploymentMetadataLabels = JSON.parse(deployment.metadata.labels);
      const deploymentSpecSelectorMatchLabels = JSON.parse(
        deployment.spec.selector.matchLabels,
      );
      const deploymentSpecTemplateMetadataLabels = JSON.parse(
        deployment.spec.template.metadata.labels,
      );
      const deploymentSpecTemplateSpecContainers = JSON.parse(
        deployment.spec.template.spec.containers,
      );
      const serviceMetadataLabels = JSON.parse(service.metadata.labels);

      const serviceSpecSelector = JSON.parse(service.spec.selector);
      const serviceSpecPorts = JSON.parse(service.spec.ports);
      const deploymentInfo = {
        ...deployment,
        metadata: {
          ...deployment.metadata,
          labels: deploymentMetadataLabels,
        },
        spec: {
          ...deployment.spec,
          selector: {
            matchLabels: deploymentSpecSelectorMatchLabels,
          },
          template: {
            ...deployment.template,
            metadata: {
              labels: deploymentSpecTemplateMetadataLabels,
            },
            spec: {
              containers: deploymentSpecTemplateSpecContainers,
            },
          },
        },
      };
      const serviceInfo = {
        ...service,
        metadata: {
          ...service.metadata,
          labels: serviceMetadataLabels,
          name: deployment.metadata.name,
        },
        spec: {
          ...service.spec,
          selector: serviceSpecSelector,
          ports: serviceSpecPorts,
        },
      };
      submitData(deploymentInfo, serviceInfo);
    } catch (e) {
      console.log(e);
      message.error('JSON格式错误');
    }
  }

  async function submitData(deployment = {}, service = {}) {
    const namespace = form.getFieldValue('namespace');
    try {
      await createDeployment(deployment, namespace);
      try {
        await createService(service, namespace);
        message.success('创建成功', 2, () => history.push('/'));
      } catch (error) {
        await deleteDeployment(deployment.metadata.name, namespace);
        message.error('创建失败');
      }
    } catch (e) {
      message.error('创建失败');
    }
  }
  const handleClick = () => {
    form.validateFields().then(data => {
      checkAndWrapperData(data);
    });
  };
  return (
    <Layout>
      <Form {...formItemLayout} form={form}>
        <Title level={4}>Deployment Info</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'metadata', 'name']}
              label="Name"
              rules={[{ required: true, message: '请输入应用名称' }]}
            >
              <Input placeholder="请输入应用名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="namespace"
              label="Namespace"
              rules={[{ required: true, message: '请输入命名空间' }]}
            >
              <Input placeholder="请输入命名空间" readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'spec', 'replicas']}
              label="Replicas"
              rules={[
                { required: true, message: '请输入节点数', type: 'number' },
              ]}
            >
              <InputNumber placeholder="请输入节点数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'metadata', 'labels']}
              label="Labels"
              rules={[
                {
                  required: true,
                  message:
                    '请输入标签与值（JSON对象），例如：{"app": "demo", "version": "1.7"}',
                },
              ]}
            >
              <Input placeholder="请输入标签与值（JSON对象）" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'spec', 'selector', 'matchLabels']}
              label="MatchLabels"
              rules={[
                {
                  required: true,
                  message:
                    '请输入匹配规则（JSON对象），例如：{"app": "demo", "version": "1.7"}',
                },
              ]}
            >
              <Input placeholder="请输入匹配规则" />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4}>Pod Template</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'spec', 'template', 'metadata', 'labels']}
              label="Labels"
              rules={[
                {
                  required: true,
                  message:
                    '请输入标签与值（JSON对象），例如：{"app": "demo", "version": "1.7"}',
                },
              ]}
            >
              <Input placeholder="请输入标签与值（JSON对象）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['deployment', 'spec', 'template', 'spec', 'containers']}
              label="Containers"
              rules={[
                {
                  required: true,
                  message:
                    '请输入容器名称与镜像（JSON数组）,例如：[{"name": "demo1", "image": "image1"}, {"name": "demo2", "image": "image2"},]',
                },
              ]}
            >
              <Input placeholder='例如：[{"name": "demo1", "image": "image1"}, {"name": "demo2", "image": "image2"},]' />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4}>Service</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['service', 'spec', 'type']}
              label="Type"
              rules={[{ required: true, message: '请选择服务类型' }]}
            >
              <Select placeholder="请选择服务类型">
                <Option value="ClusterIP">ClusterIP</Option>
                <Option value="LoadBalancer">LoadBalancer</Option>
                <Option value="NodePort">NodePort</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['service', 'metadata', 'labels']}
              label="Labels"
              rules={[
                {
                  required: true,
                  message:
                    '请输入标签与值（JSON对象），例如：{"app": "demo", "version": "1.7"}',
                },
              ]}
            >
              <Input placeholder="请输入标签与值（JSON对象）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['service', 'spec', 'selector']}
              label="Selector"
              rules={[
                {
                  required: true,
                  message:
                    '请输入Selector（JSON对象），例如：{"app": "demo", "version": "1.7"}',
                },
              ]}
            >
              <Input placeholder="请输入Selector（JSON对象）" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['service', 'spec', 'ports']}
              label="Ports"
              rules={[
                {
                  required: true,
                  message:
                    '请输入端口信息（JSON数组）,例如：[{"port": 80, "targetPort": 8080}]',
                },
              ]}
            >
              <Input placeholder='例如：[{"port": 80, "targetPort": 8080}]' />
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
export default NewDeployment;
