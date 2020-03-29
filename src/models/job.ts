import { fetchViewInfo } from '../services/index';
import { ViewInfo } from '../types/api';

interface ViewModel extends ViewInfo {
  jobs: [];
  loading: boolean;
  viewName: '';
}

interface Payload {
  name: string;
  data?: any;
  [properName: string]: any;
}

export default {
  namespace: 'job',
  state: {
    loading: true,
    jobs: [],
    viewName: '',
  },
  reducers: {
    updateViewInfo(state: ViewModel, payload: Payload) {
      const newInfo = payload.data || {};
      return Object.assign(state, newInfo, { loading: false });
    },
  },
  effects: {
    *fetchViewInfo(payload: Payload, { call, put }) {
      const name = payload.name;
      const res = yield call(fetchViewInfo, name);
      yield put({
        type: 'updateViewInfo',
        data: res,
      });
    },
  },
};
