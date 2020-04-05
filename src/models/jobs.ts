import { fetchJobList, fetchJobInfo } from '../services/index';
import { JobList } from '../types/api';

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
    deleteJob(state: State, payload: Payload) {
      const name = payload.name || '';
      return {
        ...state,
        visible: false,
        list: state.list.filter(job => job.name !== name),
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
  },
};
