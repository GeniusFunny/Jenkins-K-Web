import {
  fetchDeploymentList,
  createDeployment,
  deleteDeployment,
  rollbackDeployment,
  updateDeployment,
} from '../services/index';
import { DeploymentList } from '../types/api';
import { message } from 'antd';

interface State {
  list: DeploymentList;
  loding: boolean;
}
interface Payload {
  [property: string]: any;
}
export default {
  namespace: 'deployments',
  state: {
    loading: true,
    list: [],
    currentDeployment: {},
    visible: false,
  },
  reducers: {
    updateList(state: State, payload: Payload) {
      const list = payload.data || [];
      return {
        loading: false,
        list,
      };
    },
    showDeploymentInfo(state: State, payload: Payload) {
      const name = payload.name || '';
      const namespace = payload.namespace;
      return {
        ...state,
        currentDeployment: state.list.find(
          deployment =>
            deployment.metadata.name === name &&
            deployment.metadata.namespace === namespace,
        ),
        visible: true,
      };
    },
    hiddenDeploymentInfo(state: State) {
      return {
        ...state,
        visible: false,
      };
    },
    start(state: State) {
      return {
        ...state,
        loading: true,
      };
    },
    finished(state: State) {
      return {
        ...state,
        loading: false,
      };
    },
  },
  effects: {
    *fetchList(payload: Payload, { call, put }) {
      try {
        const res = yield call(fetchDeploymentList);
        const { body = {} } = res;
        const { items = [] } = body;
        yield put({
          type: 'updateList',
          data: items,
        });
      } catch (e) {
        message.error(`获取失败，${e.message}`, 1, () => {
          put({
            type: 'finished',
          });
        });
      }
    },
    *create(payload: Payload, { call, put }) {
      const data = payload.data;
      const namespace = payload.namespace;
      try {
        yield put({
          type: 'start',
        });
        yield call(createDeployment, data, namespace);
        message.success('新建成功', 1, () => {
          put({
            type: 'fetchList',
          });
        });
      } catch (e) {
        message.error(`创建失败, ${e.message}`, 1, () => {
          put({
            type: 'finished',
          });
        });
      }
    },
    *delete(payload: Payload, { call, put }) {
      const name = payload.name || '';
      const namespace = payload.namespace;
      try {
        yield put({
          type: 'start',
        });
        yield call(deleteDeployment, name, namespace);
        message.success('删除成功', 1, () => {
          put({
            type: 'fetchList',
          });
        });
      } catch (e) {
        message.error(`删除失败，${e.message}`, 1, () => {
          put({
            type: 'finished',
          });
        });
      }
    },
    *update(payload: Payload, { call, put }) {
      const name = payload.name || '';
      const namespace = payload.namespace;
      const data = payload.data;
      try {
        yield put({
          type: 'start',
        });
        yield call(updateDeployment, name, data, namespace);
        yield put({
          type: 'fetchList',
        });
        yield put({
          type: 'finished',
        });
        message.success('更新成功', 1, () => {
          put({
            type: 'hiddenDeploymentInfo',
          });
        });
      } catch (e) {
        message.error(`更新失败，${e.message}`, 1, () => {
          put({
            type: 'finished',
          });
        });
      }
    },
    *rollback(payload: Payload, { call, put }) {
      const name = payload.name || '';
      const namespace = payload.namespace;
      try {
        yield put({
          type: 'start',
        });
        yield call(rollbackDeployment, name, namespace);
        message.success('回滚成功');
        yield put({
          type: 'fetchList',
        });
        yield put({
          type: 'finished',
        });
      } catch (e) {
        message.error(`回滚失败, ${e.message}`, 1, () => {
          put({
            type: 'finished',
          });
        });
      }
    },
  },
};
