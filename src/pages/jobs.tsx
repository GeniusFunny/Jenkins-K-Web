import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { Table, Tag, Button } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';

type JobClass = {
  'hudson.model.FreeStyleProject': string;
  'org.jenkinsci.plugins.workflow.job.WorkflowJob': string;
  [props: string]: string;
};
function Jobs(props: any) {
  const mapJobClassToName: JobClass = {
    'hudson.model.FreeStyleProject': '自由风格的软件项目',
    'org.jenkinsci.plugins.workflow.job.WorkflowJob': '流水线',
  };
  const { list = [], loading = true } = props.data;
  const columns = [
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
      render: (_class: string | number) => (
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
      render: (data: { number: React.ReactNode }) => (
        <span>{data ? data.number : '无'}</span>
      ),
    },
    {
      title: '上次成功构建',
      dataIndex: 'lastSuccessfulBuild',
      key: 'lastSuccessfulBuild',
      render: (data: { number: React.ReactNode }) => (
        <span>{data ? data.number : '无'}</span>
      ),
    },
    {
      title: '当前状态',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) =>
        color === 'red' ? (
          <Tag color="error">failed</Tag>
        ) : (
          <Tag color="success">success</Tag>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: { name: string }) => (
        <div>
          <SettingOutlined
            style={{ marginRight: 20 }}
            onClick={() => history.push(`/editJob?job=${record.name}`)}
          />
          <DeleteOutlined onClick={() => onDelete(record.name)} />
        </div>
      ),
    },
  ];
  function onAdd() {
    history.push('/newJob');
  }
  function onDelete(name: string) {
    props.dispatch({
      type: 'jobs/deleteJob',
      name,
    });
  }
  useEffect(() => {
    props.dispatch({
      type: 'jobs/fetchList',
    });
  }, []);
  return (
    <>
      <Button type="primary" onClick={onAdd} style={{ marginBottom: 16 }}>
        新增任务
      </Button>
      <Table
        columns={columns}
        loading={loading}
        dataSource={list}
        scroll={{ x: true }}
      />
    </>
  );
}

export default connect(({ jobs }) => ({
  data: jobs,
}))(Jobs);
