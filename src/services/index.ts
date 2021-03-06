import 'whatwg-fetch';
import { ViewInfo, ViewList, JobList, JobInfo } from '../types/api';

const API = 'http://localhost:7001/api';
const JenkinsPath = `${API}/jenkins`;
const K8sPath = `${API}/k8s`;
const deployPath = `${API}/deploy`;

function api<T>(url: string, options?: object): Promise<T> {
  if (options) {
    options = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      body: JSON.stringify(options.body),
    };
  }
  return fetch(url, options).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

/* Jenkins API*/

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
    body: data,
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
  return api<{}>(`${JenkinsPath}/jobs`, {
    method: 'POST',
    body: data,
  });
}

function deleteJob(name: string) {
  return api<{}>(`${JenkinsPath}/jobs/${name}`, { method: 'DELETE' });
}

function fetchJobConfig(name: string) {
  return api<{}>(`${JenkinsPath}/jobConfig?job=${name}`);
}

function updateJobConfig(name: string, data: {}) {
  return api<{}>(`${JenkinsPath}/jobConfig?job=${name}`, {
    method: 'PUT',
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
function fetchBuildInfo(job, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/info?job=${job}&view=${view}`);
}
function fetchLastBuildInfo(job, id, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/last?job=${job}&id=${id}&view=${view}`);
}
function fetchLastSuccessfulBuildInfo(job, id, view = 'all') {
  return api<{}>(
    `${JenkinsPath}/build/lastSuccessfulBuild?job=${job}&id=${id}&view=${view}`,
  );
}
function startNewBuild(job, nextBuildNumber = 1, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/start`, {
    method: 'POST',
    body: { job, view, nextBuildNumber },
  });
}
function stopBuild(job, id, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/stop`, {
    method: 'POST',
    body: { job, view, id },
  });
}
function deleteBuild(job, id, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/delete`, {
    method: 'DELETE',
    body: { job, view, id },
  });
}
function fetchBuildLog(job, id, view = 'all') {
  return api<{}>(`${JenkinsPath}/build/log?job=${job}&id=${id}&view=${view}`);
}

/* Login */
/* Opertion */

/* Kubernetes  API */

/* Deployment */
function fetchDeploymentList(namespace = 'default') {
  return api<{}>(`${K8sPath}/deployments?namespace=${namespace}`);
}

function fetchDeploymentInfo(deployment, namespace = 'default') {
  return api<{}>(`${K8sPath}/deployments/${deployment}?namespace=${namespace}`);
}

function updateDeployment(deployment, patchData, namespace = 'default') {
  patchData.namespace = namespace;
  return api<{}>(`${K8sPath}/deployments/${deployment}`, {
    method: 'PUT',
    body: patchData,
  });
}

function rollbackDeployment(deployment, namespace = 'default') {
  return api<{}>(`${K8sPath}/rollback`, {
    method: 'POST',
    body: {
      deployment,
      namespace,
    },
  });
}

function deleteDeployment(deployment, namespace = 'default') {
  return api<{}>(`${K8sPath}/deployments/${deployment}`, {
    method: 'DELETE',
    body: {
      namespace,
    },
  });
}

function scaleDeployment(deployment, size = 3, namespace = 'default') {
  return api<{}>(`${K8sPath}/scale`, {
    method: 'DELETE',
    body: {
      deployment,
      size,
      namespace,
    },
  });
}
function createDeployment(data, namespace = 'default') {
  return api<{}>(`${K8sPath}/deployments`, {
    method: 'POST',
    body: {
      ...data,
      namespace,
    },
  });
}
/* Service */

function fetchServiceList(namespace = 'default') {
  return api<{}>(`${K8sPath}/services?namespace=${namespace}`);
}
function fetchServiceInfo(service, namespace = 'default') {
  return api<{}>(`${K8sPath}/services/${service}?namespace=${namespace}`);
}
function updateService(service, patchData, namespace = 'default') {
  patchData.namespace = namespace;
  return api<{}>(`${K8sPath}/services/${service}`, {
    method: 'PUT',
    body: patchData,
  });
}
function deleteService(service, namespace = 'default') {
  return api<{}>(`${K8sPath}/services/${service}`, {
    method: 'DELETE',
    body: {
      namespace,
    },
  });
}
function createService(data, namespace = 'default') {
  return api<{}>(`${K8sPath}/services`, {
    method: 'POST',
    body: {
      ...data,
      namespace,
    },
  });
}

/* Deplpy */

function fetchDeployInfo(job, view = 'all') {
  return api<{}>(`${deployPath}/info?job=${job}&view=${view}`);
}

function fetchDeployStatus(id) {
  return api<{}>(`${deployPath}/status?id=${id}`);
}

function updateBuildStatus(id) {
  return api<{}>(`${deployPath}/updateBuildStatus`, {
    method: 'POST',
    body: { id },
  });
}

function updateDeployStatus(id, env = 'dev') {
  return api<{}>(`${deployPath}/updateDeploymentStatus`, {
    method: 'POST',
    body: { id, env },
  });
}

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
  fetchDeploymentList,
  fetchDeploymentInfo,
  createDeployment,
  deleteDeployment,
  updateDeployment,
  rollbackDeployment,
  scaleDeployment,
  fetchServiceList,
  fetchServiceInfo,
  createService,
  deleteService,
  updateService,
  fetchDeployInfo,
  fetchBuildLog,
  fetchBuildInfo,
  fetchLastBuildInfo,
  fetchLastSuccessfulBuildInfo,
  deleteBuild,
  startNewBuild,
  stopBuild,
  fetchDeployStatus,
  updateBuildStatus,
  updateDeployStatus,
};
