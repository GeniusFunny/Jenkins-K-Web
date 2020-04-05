import 'whatwg-fetch';
import { ViewInfo, ViewList, JobList, JobInfo } from '../types/api';

const API = 'http://localhost:7001/api';
const JenkinsPath = `${API}/jenkins`;

function api<T>(url: string, options?: object): Promise<T> {
  return fetch(url, options).then(response => {
    console.log(response);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 201) return;
    return response.json();
  });
}
/* View */
function fetchViewInfo(name: string) {
  return api<ViewInfo>(`${JenkinsPath}/views/${name}`);
}

function fetchViewList() {
  return api<ViewList>(`${JenkinsPath}/views`);
}

function createView(data: object) {
  return api<{}>(`${JenkinsPath}/views`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function deleteView(name: string) {
  return api<{}>(`${JenkinsPath}/views/${name}`, { method: 'DELETE' });
}

function fetchViewConfig(name: string) {
  return api<{}>(`${JenkinsPath}/viewConfig?view=${name}`);
}

function updateViewConfig(name: string, data: {}) {
  return api<{}>(`${JenkinsPath}/viewConfig?view=${name}`, {
    method: 'POST',
    body: data,
  });
}

/* Job */
function fetchJobList() {
  return api<JobList>(`${JenkinsPath}/jobs`);
}
function fetchJobInfo(name: string) {
  return api<JobInfo>(`${JenkinsPath}/jobs/${name}`);
}
function createJob(data: object) {
  return api<{}>(`${JenkinsPath}/jobs`, { method: 'POST', body: data });
}

function deleteJob(name: string) {
  return api<{}>(`${JenkinsPath}/jobs/${name}`, { method: 'DELETE' });
}

function fetchJobConfig(name: string) {
  return api<{}>(`${JenkinsPath}/jobConfig?job=${name}`);
}

function updateJobConfig(name: string, data: {}) {
  return api<{}>(`${JenkinsPath}/jobConfig?job=${name}`, {
    method: 'POST',
    body: data,
  });
}

function disableJob(name: string) {
  return api<{}>(`${JenkinsPath}/job/disable`, {
    method: 'POST',
    body: { job: name },
  });
}

function enableJob(name: string) {
  return api<{}>(`${JenkinsPath}/job/enable`, {
    method: 'POST',
    body: { job: name },
  });
}

/* Build */
/* Login */
/* Opertion */

export {
  fetchViewInfo,
  fetchViewList,
  fetchViewConfig,
  createView,
  deleteView,
  updateViewConfig,
  fetchJobList,
  fetchJobInfo,
  createJob,
  deleteJob,
  fetchJobConfig,
  updateJobConfig,
  disableJob,
  enableJob,
};
