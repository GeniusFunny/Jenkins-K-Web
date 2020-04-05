import React from 'react';
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
  List,
  Card,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '任务',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '类型',
        key: '_class',
        dataIndex: '_class',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '当前状态',
        dataIndex: 'color',
        key: 'color',
        render: color => {
          if (color === 'red') return <span>失败</span>;
          return <span>成功</span>;
        },
      },
      {
        title: '上次构建',
        dataIndex: 'lastBuild',
        key: 'lastBuild',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <div>
            <EditOutlined
              onClick={() => this.showDrawer(record.name)}
              style={{ marginRight: 20 }}
            />
            <DeleteOutlined onClick={() => this.onDelete(record.name)} />
          </div>
        ),
      },
    ];
    this.type = 1;
    this.data = {};
  }
  showDrawer = name => {
    this.type = typeof name === 'undefined' ? 0 : 1;
    this.props.dispatch({
      type: 'jobs/showJobInfo',
      name,
    });
  };
  onAdd = () => {
    this.showDrawer();
  };
  onClose = () => {
    this.props.dispatch({
      type: 'jobs/hiddenJobInfo',
    });
  };
  onDelete = name => {
    this.props.dispatch({
      type: 'jobs/deleteJob',
      name,
    });
  };
  onSubmit = () => {
    this.onClose();
    if (this.type) {
      this.updateJobInfo();
    } else {
      this.addNewJob();
    }
  };
  onCancel = () => {
    this.onClose();
  };
  handleValueChange = (changedValues, allValues) => {
    this.data = allValues;
  };
  updateJobInfo = () => {
    const { data, dispatch } = this.props;
    const { currentJob } = data;
    const jobInfo = Object.assign({}, data, this.data);
    dispatch({
      type: 'jobs/',
    });
  };
  addNewJob = () => {};

  render() {
    const { data } = this.props;
    const { list = [], loading = true, visible, currentJob = {} } = data;
    return (
      <>
        <Button
          onClick={this.onAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a Job
        </Button>
        <Table columns={this.columns} loading={loading} dataSource={list} />
        <Drawer
          title={this.type ? '修改任务' : '新增任务'}
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
                  label="任务名称"
                  rules={[{ required: true, message: '请输入任务名称' }]}
                >
                  <Input
                    placeholder="请输入任务名称"
                    defaultValue={currentJob.name}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="_class"
                  label="类型"
                  rules={[{ required: true, message: '选择任务类型' }]}
                >
                  <Select
                    placeholder="请选择任务类型"
                    defaultValue={currentJob._class}
                  >
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
                  <Input.TextArea
                    rows={4}
                    placeholder="请输入任务描述"
                    defaultValue={currentJob.description}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            bordered={true}
            dataSource={currentJob.jobs}
            header={'构建任务'}
            renderItem={item => (
              <List.Item
                actions={[
                  <Link to={`/jobs/${item.name}`}>
                    <a key="list-loadmore-more">more</a>
                  </Link>,
                ]}
              >
                <span>{item.name}</span>
              </List.Item>
            )}
          />
        </Drawer>
      </>
    );
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'jobs/fetchList',
    });
  }
}

export default connect(({ jobs }) => ({
  data: jobs,
}))(Jobs);
