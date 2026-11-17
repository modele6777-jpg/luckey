import { installFullAppSandbox } from './fullAppSandbox';
installFullAppSandbox(window);
// Install the network boundary before evaluating any app/provider module.
void import('../main');

// Test-origin-only entry point: inspect the real app without changing layout rules.
const diagnosticButton = document.createElement('button');
diagnosticButton.id = 'full-app-test-diagnostics';
diagnosticButton.type = 'button';
diagnosticButton.textContent = '화면 진단';
diagnosticButton.style.cssText = 'position:fixed;z-index:2147483646;top:max(8px,env(safe-area-inset-top,0px));left:8px;padding:7px 10px;border:1px solid #94a3b8;border-radius:10px;background:#111827;color:white;font:12px system-ui;pointer-events:auto';
diagnosticButton.onclick = () => { void import('../lib/viewportDiagnostics').then(module => module.showViewportDiagnostics()); };
document.body.appendChild(diagnosticButton);
