import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import {
  Table,
  Tag,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

function Views(props: any) {
  const { data, dispatch } = props;
  const [form] = Form.useForm();
  const { list = [], loading = true, visible } = data;
  const columns = [
    {
      title: '视图',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      key: '_class',
      dataIndex: '_class',
      render: type => {
        let listViewReg = /ListView/g;
        return listViewReg.test(type) ? '列表视图' : '所有视图';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '任务',
      dataIndex: 'jobs',
      key: 'jobs',
      render: (jobs: { name: React.ReactNode }[]) =>
        jobs.map((item: { name: React.ReactNode }) => (
          <Link to={`/jobs/${item.name}`}>
            <Tag color={'geekblue'}>{item.name}</Tag>
          </Link>
        )),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: { name: string }) => (
        <DeleteOutlined onClick={() => onDelete(record.name)} />
      ),
    },
  ];
  useEffect(() => {
    dispatch({
      type: 'views/fetchList',
    });
  }, []);
  function showDrawer(name?: string) {
    dispatch({
      type: 'views/showViewInfo',
      name: name,
    });
  }
  function onAdd() {
    showDrawer();
  }
  function onClose() {
    dispatch({
      type: 'views/hiddenViewInfo',
    });
  }
  function onDelete(name: string) {
    dispatch({
      type: 'views/delete',
      name,
    });
  }
  function onSubmit() {
    form.validateFields().then(data => {
      dispatch({
        type: 'views/addNewView',
        data,
      });
    });
  }
  function onCancel() {
    onClose();
  }
  return (
    <>
      <Button onClick={onAdd} type="primary" style={{ marginBottom: 16 }}>
        新增视图
      </Button>
      <Table columns={columns} loading={loading} dataSource={list} />
      <Drawer
        title={'新增'}
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
                name="name"
                label="视图名称"
                rules={[{ required: true, message: '请输入视图名称' }]}
              >
                <Input placeholder="请输入视图名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mode"
                label="类型"
                rules={[{ required: true, message: '选择视图类型' }]}
              >
                <Select placeholder="请选择视图类型">
                  <Option value="hudson.model.ListView">列表视图</Option>
                  <Option value="hudson.model.AllView">所有视图</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="描述"
                rules={[
                  {
                    required: false,
                    message: '请输入描述',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="请输入视图描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
export default connect(({ views }) => ({
  data: views,
}))(Views);
