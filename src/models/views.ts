import {
  fetchViewList,
  createView,
  updateViewConfig,
  deleteView,
} from '../services/index';
import { ViewList } from '../types/api';
import { message } from 'antd';

interface State {
  list: ViewList;
  loding: boolean;
}
interface Payload {
  [property: string]: any;
}
export default {
  namespace: 'views',
  state: {
    loading: true,
    list: [],
    currentView: {},
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
    showViewInfo(state: State, payload: Payload) {
      const name = payload.name || '';
      return {
        ...state,
        currentView: state.list.find(view => view.name === name),
        visible: true,
      };
    },
    hiddenViewInfo(state: State) {
      return {
        ...state,
        visible: false,
      };
    },
    deleteView(state: State, payload: Payload) {
      const name = payload.name || '';
      return {
        ...state,
        visible: false,
        list: state.list.filter(view => view.name !== name),
      };
    },
  },
  effects: {
    *fetchList(payload: Payload, { call, put }) {
      try {
        const list = yield call(fetchViewList);
        yield put({
          type: 'updateList',
          data: list,
        });
      } catch (e) {
        message.error(`加载失败，${e.message}`);
      }
    },
    *addNewView(payload: Payload, { call, put }) {
      const info = payload.data;
      try {
        yield call(createView, info);
        message.success('新建成功');
        yield put({
          type: 'fetchList',
        });
      } catch (e) {
        message.error(`创建失败，${e.message}`);
      }
    },
    *delete(payload: Payload, { call, put }) {
      const view = payload.name;
      try {
        yield call(deleteView, view);
        message.success('删除成功');
        yield put({
          type: 'fetchList',
        });
      } catch (e) {
        message.error(`删除失败，${e.message}`);
      }
    },
  },
};
