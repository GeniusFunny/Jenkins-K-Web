import 'whatwg-fetch';
import { ViewInfo } from '../types/api';

const API = 'http://localhost:7001/api';
const JenkinsPath = `${API}/jenkins`;

function api<T>(url: string, options?: object): Promise<T> {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function fetchViewInfo(name: string) {
  return api<ViewInfo>(`${JenkinsPath}/view/${name}`);
}

function fetchJobInfo(name: string) {
  return api<ViewInfo>(`${JenkinsPath}/job/${name}`);
}

export { fetchViewInfo, fetchJobInfo };
