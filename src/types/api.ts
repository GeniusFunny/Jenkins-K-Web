import { BasicInterface } from './basic';

export interface ViewInfo extends BasicInterface {
  name: string;
  jobs: [];
  description: string;
  _class: string;
  property: [];
  code: number;
}

export interface JobInfo extends BasicInterface {
  _class: string;
  actions: [];
  description: string;
  name: string;
  builds: [];
  firstBuild: {};
  lastBuild: {};
  healthReport: [];
}

export interface ViewList {
  [index: number]: {
    _class: string;
    name: string;
    url: string;
  };
}
export interface JobList {
  [index: number]: {
    _class: string;
    name: string;
    url: string;
    color: string;
  };
}
