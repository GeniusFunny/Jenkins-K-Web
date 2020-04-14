import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import {
  Table,
  Drawer,
  Form,
  Tag,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
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
function Deployments(props: any) {
  const [form] = Form.useForm();
  const { data = {}, dispatch } = props;
  const { list = [], loading = true, visible, currentDeployment = {} } = data;
  const columns = [
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
      render: (time: string | undefined) => parseTime(time),
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
      render: (strategy: React.ReactNode) => (
        <Tag color="#2db7f5">{strategy}</Tag>
      ),
    },
    {
      title: '运行镜像',
      dataIndex: ['spec', 'template', 'spec', 'containers'],
      align: 'center',
      render: (containers: string | any[]) => (
        <span>{containers.length ? containers[0].image : '无'}</span>
      ),
    },
    // {
    //   title: '端口',
    //   dataIndex: ['spec', 'template', 'spec', 'containers'],
    //   align: 'center',
    //   render: (containers: string | any[]) => (
    //     <span>
    //       {containers.length && Array.isArray(containers[0].ports)
    //         ? containers[0].ports[0].containerPort
    //         : '无'}
    //     </span>
    //   ),
    // },
    {
      title: '状态',
      dataIndex: ['status'],
      align: 'center',
      render: (
        status:
          | {
              replicas: number;
              updatedReplicas: number;
              readyReplicas: number;
              availableReplicas: number;
            }
          | undefined,
      ) => judgeDeploymentStatus(status),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 200,
      render: (
        text: any,
        record: { metadata: { name: any; namespace: any } },
      ) => (
        <div>
          <EditOutlined
            onClick={() =>
              showDrawer(record.metadata.name, record.metadata.namespace)
            }
            style={{ marginRight: 20 }}
          />
          <DeleteOutlined
            style={{ marginRight: 20 }}
            onClick={() =>
              onDelete(record.metadata.name, record.metadata.namespace)
            }
          />
          <RollbackOutlined
            onClick={() =>
              onRollback(record.metadata.name, record.metadata.namespace)
            }
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch({
      type: 'deployments/fetchList',
    });
  }, []);
  useEffect(() => {
    form.setFieldsValue(currentDeployment);
  }, [currentDeployment]);
  function showDrawer(name: string, namespace = 'default') {
    dispatch({
      type: 'deployments/showDeploymentInfo',
      name,
      namespace,
    });
  }
  function onClose() {
    dispatch({
      type: 'deployments/hiddenDeploymentInfo',
    });
  }
  function onDelete(name: string, namespace = 'default') {
    dispatch({
      type: 'deployments/delete',
      name,
      namespace,
    });
  }
  function onRollback(name: string, namespace = 'default') {
    dispatch({
      type: 'deployments/rollback',
      name,
      namespace,
    });
  }
  function onSubmit() {
    form.validateFields().then(data => {
      const deployment = {
        ...currentDeployment,
        spec: {
          ...currentDeployment.spec,
          ...data.spec,
        },
      };
      updateDeploymentInfo(deployment);
    });
  }
  function onCancel() {
    onClose();
  }
  function updateDeploymentInfo(data: any) {
    dispatch({
      type: 'deployments/update',
      data: data,
      name: data.metadata.name,
      namespace: data.metadata.namespace,
    });
  }
  return (
    <>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link to="/newDeployment">新增应用</Link>
      </Button>
      <Table
        columns={columns}
        loading={loading}
        dataSource={list}
        scroll={{ x: true }}
      />
      <Drawer
        title={'修改'}
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={onSubmit} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['spec', 'strategy', 'type']}
                label="更新策略"
                rules={[{ required: true, message: '选择更新策略' }]}
              >
                <Select placeholder="请选择更新策略">
                  <Option value="RollingUpdate">滚动更新</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name={['spec', 'replicas']}
                label="节点数"
                rules={[
                  { required: true, message: '请输入节点数', type: 'number' },
                ]}
              >
                <InputNumber placeholder="请输入节点数" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}

export default connect(({ deployments }) => ({
  data: deployments,
}))(Deployments);
