import { installFullAppSandbox } from './fullAppSandbox';
installFullAppSandbox(window);
// Install the network boundary before evaluating any app/provider module.
void import('../main');
