import { BasicInterface } from './basic';

export interface ViewInfo extends BasicInterface {
  name: string;
  jobs: [];
  description: string;
  _class: string;
  property: [];
  code: number;
}
