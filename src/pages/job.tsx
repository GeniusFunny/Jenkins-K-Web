import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
const JobColumns = [
  {
    title: 'Job Name',
    dataIndex: 'name',
  },
  {
    title: 'Url',
    dataIndex: 'url',
  },
];

class Jobs extends Component {
  getInfo = (name: string) => {
    this.props.dispatch({
      type: 'job/fetchViewInfo',
      name,
    });
  };
  componentDidMount() {
    this.getInfo('yang123456');
  }
  render() {
    const { data = {} } = this.props;
    const loading = data.loading || false;
    const jobs = data.jobs.map(item => ({ ...item, key: item.name })) || [];
    return <Table dataSource={jobs} columns={JobColumns} loading={loading} />;
  }
}

export default connect(({ job }) => ({
  data: job,
}))(Jobs);
