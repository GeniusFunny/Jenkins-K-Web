import React, { useEffect, useState } from 'react';
import {
  Steps,
  Button,
  message,
  Card,
  Layout,
  Row,
  Col,
  Typography,
  Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import {
  fetchDeployInfo,
  startNewBuild,
  updateBuildStatus,
  updateDeployStatus,
} from '../services/index';
import './deploy.css';

const { Step } = Steps;
const { Title, Paragraph, Text } = Typography;

const steps = [
  {
    title: '代码',
    content: 'Coding',
  },
  {
    title: '构建',
    content: 'Build',
  },
  {
    title: '单元测试',
    content: 'Unit-Testing',
  },
  {
    title: '构建/推送镜像',
    content: 'Build Image and Push Image',
  },
  {
    title: '测试环境',
    content: 'Deliver-Dev',
  },
  {
    title: '生产环境',
    content: 'Deliver-Prod',
  },
  {
    title: '完成',
    content: 'Yes',
  },
];

function Deploy(props: any) {
  let { job = '', view = 'all', nextBuildNumber = 0 } = props.location.query;
  const [deployId, setDeployId] = useState('');
  const [log, setLog] = useState('');
  const [current, setCurrent] = useState(1);
  const [building, setBuilding] = useState(false);
  const [lastBuild, setLastBuild] = useState({
    name: '',
    time: '',
    imageTag: '',
  });
  const [devDeployment, setDevDeployment] = useState({
    name: '',
    time: '',
    imageTag: '',
    replicas: 0,
  });
  const [prodDeployment, setProdDeployment] = useState({
    name: '',
    time: '',
    imageTag: '',
    replicas: 0,
  });

  async function getInfo() {
    try {
      let res = await fetchDeployInfo(job, view);
      const {
        lastBuild = null,
        devDeployment = null,
        prodDeployment = null,
      } = res;
      if (lastBuild) {
        setLastBuild({
          name: lastBuild.name,
          time: lastBuild.time,
          imageTag: lastBuild.imageTag,
        });
      }
      if (devDeployment) {
        setDevDeployment({
          name: devDeployment.name,
          time: devDeployment.time,
          imageTag: devDeployment.imageTag,
          replicas: devDeployment.replicas,
        });
      }
      if (prodDeployment) {
        setProdDeployment({
          name: prodDeployment.name,
          time: prodDeployment.time,
          imageTag: prodDeployment.imageTag,
          replicas: prodDeployment.replicas,
        });
      }
    } catch (e) {
      message.error('获取数据失败', 3);
    }
  }
  useEffect(() => {
    getInfo();
  }, []);
  useEffect(() => {
    if (deployId) {
      pollingStatus();
    }
  }, [deployId]);
  function next() {
    switch (current) {
      case 0:
      case 6:
        Modal.confirm({
          title: '提醒',
          icon: <ExclamationCircleOutlined />,
          content: '确认后即开始新的一轮构建',
          onOk: () =>
            history.push(
              `/deploy?job=${job}&nextBuildNumber=${parseInt(nextBuildNumber) +
                1}`,
            ),
        });
        break;
      case 1:
        build();
        break;
      case 4:
        deployDev();
        break;
      case 5:
        deployProd();
        break;
      default:
        message.warning('操作无效');
    }
  }
  async function startBuild() {
    try {
      let res = await startNewBuild(job, parseInt(nextBuildNumber), view);
      setDeployId(res.id);
    } catch (e) {
      message.error('发起构建失败', 3, () => {
        setCurrent(0);
        setBuilding(false);
      });
    }
  }
  async function pollingStatus() {
    try {
      let res = await updateBuildStatus(deployId);
      const { currentStatus, finished, log } = res;
      if (finished) {
        if (currentStatus === 'success') {
          setCurrent(6);
          message.success('此构建已完成', 3);
        } else {
          setCurrent(0);
          message.error('此构建已终止', 3);
        }
      } else {
        if (currentStatus === 'build') {
          setTimeout(() => {
            pollingStatus();
          }, 1000 * 5);
          setCurrent(1);
        } else if (currentStatus === 'pre-dev') {
          getInfo();
          setCurrent(4);
          setBuilding(false);
        } else if (currentStatus === 'pre-prod') {
          setCurrent(5);
          setBuilding(false);
        }
      }
      setLog(log);
    } catch (e) {
      setTimeout(async () => {
        await pollingStatus();
      }, 1000 * 10);
    }
  }
  async function build() {
    setCurrent(1);
    startBuild();
    setBuilding(true);
  }
  async function deployDev() {
    setBuilding(true);
    try {
      let res = await updateDeployStatus(deployId, 'dev');
      const { currentStatus } = res;
      if (currentStatus === 'pre-prod') {
        setCurrent(5);
        getInfo();
      } else {
        message.error('部署失败，请重试', 3);
      }
      setBuilding(false);
    } catch (e) {
      message.error('部署失败，请重试', 3, () => {
        setBuilding(false);
      });
    }
  }
  async function deployProd() {
    try {
      let res = await updateDeployStatus(deployId, 'prod');
      const { currentStatus } = res;
      if (currentStatus === 'success') {
        setCurrent(6);
        getInfo();
        message.success('发布完成', 5);
      } else {
        message.error('部署失败，请重试', 3);
      }
      setBuilding(false);
    } catch (e) {
      message.error('部署失败，请重试', 3, () => {
        setBuilding(false);
      });
    }
  }
  return (
    <Layout>
      <Row justify="center">
        <Title level={3}>发布应用</Title>
      </Row>
      <section>
        <Row>
          <Title level={4}>信息</Title>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="任务详情" bordered={false} className="card">
              <Paragraph>
                <Text>任务名：{lastBuild.name} </Text>
              </Paragraph>
              <Paragraph>
                <Text>镜像Tag: {lastBuild.imageTag}</Text>
              </Paragraph>
              <Paragraph>
                <Text>更新时间：{lastBuild.time}</Text>
              </Paragraph>
              <Paragraph>
                <Text>
                  <Link to={`/jobDetails?job=${job}`}>详情</Link>
                </Text>
              </Paragraph>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="测试环境" bordered={false} className="card">
              <Paragraph>
                <Text>Deployment：{devDeployment.name}</Text>
              </Paragraph>
              <Paragraph>
                <Text>镜像Tag: {devDeployment.imageTag}</Text>
              </Paragraph>
              <Paragraph>
                <Text>Replicas：{devDeployment.replicas}</Text>
              </Paragraph>
              <Paragraph>
                <Text>更新时间：{devDeployment.time}</Text>
              </Paragraph>
              <Paragraph>
                <Text>
                  <Link
                    to={`/deploymentDetail?deployment=${devDeployment.name}`}
                  >
                    详情
                  </Link>
                </Text>
              </Paragraph>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="生产环境" bordered={false} className="card">
              <Paragraph>
                <Text>Deployment：{prodDeployment.name}</Text>
              </Paragraph>
              <Paragraph>
                <Text>镜像Tag: {prodDeployment.imageTag}</Text>
              </Paragraph>
              <Paragraph>
                <Text>Replicas：{prodDeployment.replicas}</Text>
              </Paragraph>
              <Paragraph>
                <Text>更新时间：{prodDeployment.time}</Text>
              </Paragraph>
              <Paragraph>
                <Text>
                  <Link
                    to={`/deploymentDetail?deployment=${devDeployment.name}`}
                  >
                    详情
                  </Link>
                </Text>
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>
      <br />
      <br />
      <section>
        <Row>
          <Title level={4}>当前构建</Title>
        </Row>
        <Row>
          <div className="steps-action">
            <Button type="primary" onClick={() => next()} loading={building}>
              执行
            </Button>
          </div>
        </Row>
        <br />
        <Row>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={item.title} title={item.title}></Step>
            ))}
          </Steps>
        </Row>
        <br />
        <Row>
          <Paragraph className="build-log">{log}</Paragraph>
        </Row>
      </section>
    </Layout>
  );
}

export default Deploy;
