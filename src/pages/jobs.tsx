import React from 'react';
import { connect, Link, history } from 'umi';
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
  List,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const mapJobClassToName = {
  'hudson.model.FreeStyleProject': '自由风格的软件项目',
  'org.jenkinsci.plugins.workflow.job.WorkflowJob': '流水线',
};

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '任务',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '类型',
        key: '_class',
        dataIndex: '_class',
        width: 100,
        render: _class => (
          <Tag color="#108ee9">{mapJobClassToName[_class]}</Tag>
        ),
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 300,
      },
      {
        title: '上次构建',
        dataIndex: 'lastBuild',
        key: 'lastBuild',
        render: data => <span>{data ? data.number : '无'}</span>,
      },
      {
        title: '上次成功构建',
        dataIndex: 'lastSuccessfulBuild',
        key: 'lastSuccessfulBuild',
        render: data => <span>{data ? data.number : '无'}</span>,
      },
      {
        title: '当前状态',
        dataIndex: 'color',
        key: 'color',
        width: 100,
        render: color =>
          color === 'red' ? (
            <Tag color="error">failed</Tag>
          ) : (
            <Tag color="success">success</Tag>
          ),
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
            <SettingOutlined style={{ marginRight: 20 }} />
            <DeleteOutlined onClick={() => this.onDelete(record.name)} />
          </div>
        ),
      },
    ];
    this.data = {};
  }
  showDrawer = name => {
    this.props.dispatch({
      type: 'jobs/showJobInfo',
      name,
    });
  };
  onAdd = () => {
    history.push('/newJob');
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
    this.updateJobInfo();
    this.onClose();
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
          新增任务
        </Button>
        <Table columns={this.columns} loading={loading} dataSource={list} />
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
