import React from 'react';
import { connect, Link } from 'umi';
import {
  Table,
  Drawer,
  Form,
  Tag,
  Button,
  Col,
  Row,
  Input,
  Select,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  SyncOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';

const { Option } = Select;
function judgeDeploymentStatus(
  status = {
    replicas: 1,
    updatedReplicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
  },
) {
  if (status.replicas !== status.updatedReplicas) return <SyncOutlined spin />;
  if (
    status.replicas === status.availableReplicas &&
    status.replicas === status.readyReplicas
  )
    return <CheckCircleTwoTone twoToneColor="#52c41a" />;
}

function parseTime(time = '') {
  if (time) {
    const timeSplit = time.split('T');
    return timeSplit[0];
  }
  return '无';
}
class Deployments extends React.Component {
  constructor(props) {
    super(props);
    this.data = {};
    this.columns = [
      {
        title: '应用',
        dataIndex: ['metadata', 'name'],
        width: 200,
      },
      {
        title: '命名空间',
        align: 'center',
        dataIndex: ['metadata', 'namespace'],
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: ['metadata', 'creationTimestamp'],
        width: 150,
        render: time => parseTime(time),
      },
      {
        title: '节点数',
        align: 'center',
        dataIndex: ['spec', 'replicas'],
      },
      {
        title: '升级策略',
        align: 'center',
        dataIndex: ['spec', 'strategy', 'type'],
        render: strategy => <Tag color="#2db7f5">{strategy}</Tag>,
      },
      {
        title: '运行镜像',
        dataIndex: ['spec', 'template', 'spec', 'containers'],
        align: 'center',
        render: containers => (
          <span>{containers.length ? containers[0].image : '无'}</span>
        ),
      },
      {
        title: '端口',
        dataIndex: ['spec', 'template', 'spec', 'containers'],
        align: 'center',
        render: containers => (
          <span>
            {containers.length && Array.isArray(containers[0].ports)
              ? containers[0].ports[0].containerPort
              : '无'}
          </span>
        ),
      },
      {
        title: '状态',
        dataIndex: ['status'],
        align: 'center',
        render: status => judgeDeploymentStatus(status),
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <div>
            <EditOutlined
              onClick={() =>
                this.showDrawer(record.metadata.name, record.metadata.namespace)
              }
              style={{ marginRight: 20 }}
            />
            <DeleteOutlined
              style={{ marginRight: 20 }}
              onClick={() =>
                this.onDelete(record.metadata.name, record.metadata.namespace)
              }
            />
            <RollbackOutlined
              onClick={() =>
                this.onRollback(record.metadata.name, record.metadata.namespace)
              }
            />
          </div>
        ),
      },
    ];
  }
  showDrawer = (name, namespace = 'default') => {
    this.props.dispatch({
      type: 'deployments/showDeploymentInfo',
      name,
      namespace,
    });
  };
  onClose = () => {
    this.props.dispatch({
      type: 'deployments/hiddenDeploymentInfo',
    });
  };
  onDelete = (name, namespace = 'default') => {
    this.props.dispatch({
      type: 'deployments/delete',
      name,
      namespace,
    });
  };
  onRollback = (name, namespace = 'default') => {
    this.props.dispatch({
      type: 'deployments/rollback',
      name,
      namespace,
    });
  };
  onSubmit = () => {
    this.onClose();
    this.updateDeploymentInfo();
  };
  onCancel = () => {
    this.onClose();
  };
  handleValueChange = (changedValues, allValues) => {
    this.data = allValues;
  };
  updateDeploymentInfo = () => {
    const { data, dispatch } = this.props;
    const { currentDeployment } = data;
    const deploymentInfo = JSON.parse(JSON.stringify(currentDeployment));
    // 镜像修改
    if (this.data.image) {
      deploymentInfo.spec.template.spec.containers[0].image = this.data.image;
    }
    // 节点数修改
    if (this.data.replicas) {
      deploymentInfo.spec.replicas = this.data.replicas;
    }
    // 更新策略修改
    if (this.data.strategy) {
      deploymentInfo.spec.strategy.type = this.data.strategy;
    }
    dispatch({
      type: 'deployments/update',
      data: deploymentInfo,
      name: currentDeployment.metadata.name,
      namespace: currentDeployment.metadata.namespace,
    });
  };

  render() {
    const { data = {} } = this.props;
    const { list = [], loading = true, visible, currentDeployment = {} } = data;
    const { metadata = {}, spec = {} } = currentDeployment;
    const {
      template = {
        spec: {
          containers: [
            {
              name: '',
              image: '',
              ports: [
                {
                  containerPort: 80,
                  protocol: 'TCP',
                },
              ],
            },
          ],
        },
      },
      strategy = {},
    } = spec;
    return (
      <>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link to="/newDeployment">新增应用</Link>
        </Button>
        <Table
          columns={this.columns}
          loading={loading}
          dataSource={list}
          scroll={{ x: true }}
        />
        <Drawer
          title={'修改'}
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onCancel} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onSubmit} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onValuesChange={this.handleValueChange}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="应用名称"
                  rules={[{ required: true, message: '请输入应用名称' }]}
                >
                  <Input
                    placeholder="请输入应用名称"
                    defaultValue={metadata.name}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="namespace"
                  label="命名空间"
                  rules={[{ required: true, message: '请输入命名空间' }]}
                >
                  <Input
                    placeholder="请输入命名空间"
                    defaultValue={metadata.namespace}
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="strategy"
                  label="更新策略"
                  rules={[{ required: true, message: '选择更新策略' }]}
                >
                  <Select
                    placeholder="请选择更新策略"
                    defaultValue={strategy.type}
                  >
                    <Option value="RollingUpdate">滚动更新</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="replicas"
                  label="节点数"
                  rules={[
                    { required: true, message: '请输入节点数', type: 'number' },
                  ]}
                >
                  <Input
                    placeholder="请输入节点数"
                    defaultValue={spec.replicas}
                    type={'number'}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={4}>
                <Form.Item
                  name="port"
                  label="端口"
                  rules={[{ required: true, message: '请输入端口', type: 'number'}]}
                >
                  <Input
                    placeholder="请输入端口"
                    defaultValue={template.spec.containers[0].ports[0].containerPort}
                  />
                </Form.Item>
              </Col>  */}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="image"
                  label="镜像"
                  rules={[{ required: true, message: '请输入镜像' }]}
                >
                  <Input
                    placeholder="请输入镜像"
                    defaultValue={template.spec.containers[0].image}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </>
    );
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'deployments/fetchList',
    });
  }
}

export default connect(({ deployments }) => ({
  data: deployments,
}))(Deployments);
