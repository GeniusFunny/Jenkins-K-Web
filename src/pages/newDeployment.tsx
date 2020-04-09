import React, { Component } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Cascader,
  InputNumber,
  Button,
  Typography,
} from 'antd';
import styles from './newDeployment.css';

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
class Deployment extends Component {
  constructor(props) {
    super(props);
    this.data = {
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
        kind: '',
        metadata: {
          name: '',
        },
        spec: {
          selector: '',
        },
        ports: '',
      },
    };
  }
  handleValueChange = (changedValues, allValues) => {
    const keyString = Object.keys(changedValues)[0];
    const value = Object.values(changedValues)[0];
    const keys = keyString.split('.');
    const keysLen = keys.length;
    let cur = this.data;
    for (let i = 0; i < keysLen - 1; i++) {
      cur = cur[keys[i]];
    }
    cur[keys[keysLen - 1]] = value;
  };
  checkData = () => {};
  wrapperData = () => {};
  submitData = () => {};
  handleClick = () => {};
  render() {
    return (
      <Form
        {...formItemLayout}
        onValuesChange={this.handleValueChange}
        className={styles.form}
      >
        <div>
          <Title level={4}>基本信息</Title>
          <Form.Item
            name="deployment.metadata.name"
            label="应用名称"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
          <Form.Item
            name="deployment.metadata.labels"
            label="标签"
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
          <Form.Item
            name="deployment.spec.replicas"
            label="节点数"
            rules={[
              { required: true, message: '请输入节点数', type: 'number' },
            ]}
          >
            <InputNumber placeholder="请输入节点数" />
          </Form.Item>
          <Form.Item
            name="deployment.spec.selector.matchLabels"
            label="匹配规则"
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
        </div>
        <div>
          <Title level={4}>节点模版</Title>
          <Form.Item
            name="deployment.spec.template.metadata.labels"
            label="标签"
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
          <Form.Item
            name="deployment.spec.template.spec.containers"
            label="容器"
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
        </div>
        <div>
          <Title level={4}>服务信息</Title>
          <Form.Item
            name="service.name"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item
            name="service.kind"
            label="服务类型"
            rules={[{ required: true, message: '请选择服务类型' }]}
          >
            <Select placeholder="请选择服务类型">
              <Option value="Service">Service</Option>
              <Option value="LoadBalancer">LoadBalancer(推荐)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="service.labels"
            label="标签"
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

          <Form.Item
            name="service.ports"
            label="端口"
            rules={[
              {
                required: true,
                message:
                  '请输入端口信息（JSON数组）,例如：[{"port": 80, "targetPort": 8080}, {"port": 81, "targetPort": 8081}]',
              },
            ]}
          >
            <Input placeholder='例如：[{"port": 80, "targetPort": 8080}, {"port": 81, "targetPort": 8081}]' />
          </Form.Item>
        </div>
        <div className={styles.buttonContainer}>
          <Button type="primary" style={{ marginTop: 16 }} htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default Deployment;
