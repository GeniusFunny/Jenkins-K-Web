import { fetchJobList, fetchJobInfo, deleteJob } from '../services/index';
import { JobList } from '../types/api';
import { message } from 'antd';

interface State {
  list: JobList;
  loding: boolean;
}
interface Payload {
  [property: string]: any;
}
export default {
  namespace: 'jobs',
  state: {
    loading: true,
    list: [],
    currentJob: {},
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
    showJobInfo(state: State, payload: Payload) {
      const name = payload.name || '';
      return {
        ...state,
        currentView: state.list.find(job => job.name === name),
        visible: true,
      };
    },
    hiddenJobInfo(state: State) {
      return {
        ...state,
        visible: false,
      };
    },
  },
  effects: {
    *fetchList(payload: Payload, { call, put }) {
      const res = yield call(fetchJobList);
      yield put({
        type: 'updateList',
        data: res,
      });
    },
    *fetchJobInfo(payload: Payload, { call }) {
      const job = payload.name;
      const data = yield call(fetchJobInfo, job);
      return data;
    },
    *deleteJob(payload: Payload, { call, put }) {
      const name = payload.name || '';
      try {
        yield call(deleteJob, name);
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
