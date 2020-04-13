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
} from 'antd';
import { Link } from 'umi';
import Terminal from 'terminal-in-react';
import {
  fetchDeployInfo,
  startNewBuild,
  fetchBuildInfo,
  fetchBuildLog,
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
];

function Deploy(props: any) {
  const { job = '', view = 'all' } = props.location.query;
  const [current, setCurrent] = useState(0);
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
  const [log, setLog] = useState('');
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
  function next() {
    if (current === 0) {
      build();
    } else if (current === 3) {
      deployDev();
    } else if (current === 4) {
      deployProd();
    }
  }
  async function startBuild() {
    try {
      let res = await startNewBuild(job, view);
    } catch (e) {
      message.error('发起构建失败', 3, () => {
        setCurrent(0);
        setBuilding(false);
      });
    }
  }
  function getBuildLog() {}
  function build() {
    setCurrent(1);
    setBuilding(true);
  }
  function deployDev() {
    setCurrent(4);
    setBuilding(true);
  }
  function deployProd() {
    setCurrent(5);
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
              Next
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
          <Terminal
            color="black"
            backgroundColor="white"
            barColor="black"
            style={{
              fontWeight: 'bold',
              fontSize: '1em',
              width: '100%',
              height: '500px',
            }}
            msg={log}
          />
        </Row>
      </section>
    </Layout>
  );
}

export default Deploy;
